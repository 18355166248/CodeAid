import vscode from "vscode";
import { codeAidStreamingDiff } from "../../constant/vscode.context";
import { DiffLine } from "core";
import {
  belowIndexDecorationType,
  DecorationTypeRangeManager,
  greenDecorationType,
  indexDecorationType,
  redDecorationType,
} from "./decorations";
import { VerticalDiffCodeLensProps } from "./manager";

export class VerticalDiffHandler implements vscode.Disposable {
  private cancelled = false;
  private currentLineIndex: number;

  private _diffLinesQueue: DiffLine[] = [];
  // 进程锁
  private _queueLock = false;
  private newLinesAdded = 0;
  private deletionBuffer: string[] = [];

  insertedInCurrentBlock = 0;

  private redDecorationManager: DecorationTypeRangeManager;
  private greenDecorationManager: DecorationTypeRangeManager;

  constructor(
    private readonly editor: vscode.TextEditor,
    private readonly startLine: number,
    private readonly endLine: number,
    private readonly filepathToCodeLens: Map<
      string,
      VerticalDiffCodeLensProps[]
    >,
  ) {
    this.currentLineIndex = startLine;

    this.redDecorationManager = new DecorationTypeRangeManager(
      redDecorationType,
      this.editor,
    );
    this.greenDecorationManager = new DecorationTypeRangeManager(
      greenDecorationType,
      this.editor,
    );
  }

  public get range(): vscode.Range {
    const startLine = Math.min(this.startLine, this.endLine);
    const endLine = Math.max(this.startLine, this.endLine);
    return new vscode.Range(startLine, 0, endLine, Number.MAX_SAFE_INTEGER);
  }

  disposables: vscode.Disposable[] = [];
  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }

  get isCancelled() {
    return this.cancelled;
  }
  get filepath() {
    return this.editor?.document.uri.fsPath;
  }

  clear() {
    vscode.commands.executeCommand("setContext", codeAidStreamingDiff, false);
    this.dispose();
    this.filepathToCodeLens.delete(this.filepath);
    this.cancelled = true;
  }

  /**
   * 将差异行异步添加到队列中并处理
   *
   * @param diffLine 要处理的差异行，如果为undefined则不处理
   */
  async queueDiffLine(diffLine?: DiffLine) {
    if (diffLine) {
      this._diffLinesQueue.push(diffLine);
    }

    if (this._queueLock || this.editor !== vscode.window.activeTextEditor) {
      return;
    }
    this._queueLock = true;

    while (this._diffLinesQueue.length > 0) {
      const line = this._diffLinesQueue.shift();
      if (!line) continue;

      try {
        await this._handleDiffLine(line);
      } catch (error) {
        console.warn("queueDiffLine error", error);
      }
    }

    this._queueLock = false;
  }

  /**
   * 在指定行上方插入文本
   *
   * @param index 需要插入文本的行索引
   * @param text 要插入的文本
   */
  private async insertLineAboveIndex(index: number, line: string) {
    await this.insertTextAboveLine(index, line);
    this.greenDecorationManager.addLine(index);
    this.newLinesAdded++;
  }

  /**
   * 删除指定行及其后续指定数量的行
   *
   * @param index 要删除的第一行的索引（从0开始计数）
   * @param numLines 要删除的行数，默认为1
   */
  private async deleteLinesAt(index: number, numLines = 1) {
    const startLine = new vscode.Position(index, 0);
    await this.editor.edit(
      (editBuilder) => {
        editBuilder.delete(
          new vscode.Range(startLine, startLine.translate(numLines)),
        );
      },
      {
        undoStopAfter: false,
        undoStopBefore: false,
      },
    );
  }

  async _handleDiffLine(diffLine: DiffLine) {
    switch (diffLine.type) {
      case "same":
        await this.insertDeletionBuffer();
        this.incrementCurrentLineIndex();
        break;
      case "old":
        this.deletionBuffer.push(diffLine.line);
        await this.deleteLinesAt(this.currentLineIndex);
        break;
      case "new":
        await this.insertLineAboveIndex(this.currentLineIndex, diffLine.line);
        this.incrementCurrentLineIndex();
        this.insertedInCurrentBlock++;
        break;
    }
  }

  /**
   * 异步插入删除缓冲区的内容
   *
   * 插入之前删除的文本行到当前光标所在位置的上方。
   *
   * 注意事项：
   * 1. 如果删除缓冲区为空，且当前光标位置在指定范围外且当前块内没有插入任何内容，则直接返回。
   * 2. 如果删除缓冲区为空，则将当前块内插入行数重置为0并返回。
   * 3. 在插入文本后，需要更新红色装饰管理器（redDecorationManager）和绿色装饰管理器（greenDecorationManager）的装饰位置。
   * 4. 更新当前光标位置，并清空删除缓冲区。
   */
  private async insertDeletionBuffer() {
    // Don't remove trailing whitespace line
    const totalDeletedContent = this.deletionBuffer.join("\n");
    if (
      totalDeletedContent === "" &&
      this.currentLineIndex >= this.endLine + this.newLinesAdded &&
      this.insertedInCurrentBlock === 0
    ) {
      return;
    }

    if (this.deletionBuffer.length || this.insertedInCurrentBlock > 0) {
      const blocks = this.filepathToCodeLens.get(this.filepath) || [];
      blocks.push({
        start: this.currentLineIndex - this.insertedInCurrentBlock,
        numRed: this.deletionBuffer.length,
        numGreen: this.insertedInCurrentBlock,
      });
      this.filepathToCodeLens.set(this.filepath, blocks);
    }

    if (this.deletionBuffer.length === 0) {
      this.insertedInCurrentBlock = 0;
      return;
    }

    // Insert the block of deleted lines
    await this.insertTextAboveLine(
      this.currentLineIndex - this.insertedInCurrentBlock,
      totalDeletedContent,
    );
    this.redDecorationManager.addLines(
      this.currentLineIndex - this.insertedInCurrentBlock,
      this.deletionBuffer.length,
    );
    // Shift green decorations downward
    this.greenDecorationManager.shiftDownAfterLine(
      this.currentLineIndex - this.insertedInCurrentBlock,
      this.deletionBuffer.length,
    );

    // Update line index, clear buffer
    for (let i = 0; i < this.deletionBuffer.length; i++) {
      this.incrementCurrentLineIndex();
    }
    this.deletionBuffer = [];
    this.insertedInCurrentBlock = 0;
  }

  /**
   * 递增当前行索引，并更新行索引装饰
   */
  private incrementCurrentLineIndex() {
    this.currentLineIndex++;
    this.updateIndexLineDecorations();
  }

  private updateIndexLineDecorations() {
    // Highlight the line at the currentLineIndex
    // And lightly highlight all lines between that and endLine
    if (this.currentLineIndex - this.newLinesAdded >= this.endLine) {
      this.editor.setDecorations(indexDecorationType, []);
      this.editor.setDecorations(belowIndexDecorationType, []);
    } else {
      const start = new vscode.Position(this.currentLineIndex, 0);
      this.editor.setDecorations(indexDecorationType, [
        new vscode.Range(
          start,
          new vscode.Position(start.line, Number.MAX_SAFE_INTEGER),
        ),
      ]);
      const end = new vscode.Position(this.endLine, 0);
      this.editor.setDecorations(belowIndexDecorationType, [
        new vscode.Range(start.translate(1), end.translate(this.newLinesAdded)),
      ]);
    }
  }

  private async insertTextAboveLine(index: number, text: string) {
    await this.editor.edit(
      (editBuilder) => {
        const lineCount = this.editor.document.lineCount;
        if (index >= lineCount) {
          // Append to end of file
          editBuilder.insert(
            new vscode.Position(
              lineCount,
              this.editor.document.lineAt(lineCount - 1).text.length,
            ),
            `\n${text}`,
          );
        } else {
          editBuilder.insert(new vscode.Position(index, 0), `${text}\n`);
        }
      },
      {
        undoStopAfter: false,
        undoStopBefore: false,
      },
    );
  }

  async run(diffLineGenerator: AsyncGenerator<DiffLine>) {
    try {
      for await (const diffLine of diffLineGenerator) {
        if (this.isCancelled) {
          break;
        }
        await this.queueDiffLine(diffLine);
      }
    } catch (error) {
      throw error;
    }
  }

  // 同意/拒绝当前块
  async acceptRejectBlock(
    accept: boolean,
    startLine: number,
    numGreen: number,
    numRed: number,
  ) {
    console.log(
      "🚀 ~ VerticalDiffHandler ~ accept:",
      accept,
      startLine,
      numGreen,
      numRed,
    );
    if (numGreen > 0) {
      // 删除绿色高亮
      this.greenDecorationManager.deleteRangeStartingAt(startLine + numRed);
      if (!accept) {
        // 选择拒绝的话 将绿色的删除
        await this.deleteLinesAt(startLine + numRed, numGreen);
      }
    }
  }
}

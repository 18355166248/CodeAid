// 垂直diff

import vscode from "vscode";
import { ConfigHandler } from "core/config/ConfigHandler";
import { VscodeWebviewProtocol } from "../../webviewProtocol";
import { VerticalDiffHandler } from "./handler";
import {
  codeAidDiffVisible,
  codeAidStreamingDiff,
} from "../../constant/vscode.context";
import { pruneLinesFromTop } from "core/llm/countTokens";
import { streamDiffLines } from "core/edit/streamDiffLines";
import { getLanguageForFile } from "core/utils/getLanguageForFile";

export class VerticalDiffManager {
  // 缓存功能
  private filePathToHandler: Map<string, VerticalDiffHandler> = new Map();
  constructor(
    private readonly configHandler: ConfigHandler,
    private readonly webviewProtocol: VscodeWebviewProtocol,
  ) {}

  createVerticalDiffHandler(
    filepath: string,
    startLine: number,
    endLine: number,
  ): VerticalDiffHandler | undefined {
    if (this.filePathToHandler.has(filepath)) {
      const handler = this.filePathToHandler.get(filepath);
      handler?.clear();
      this.filePathToHandler.delete(filepath);
    }
    const editor = vscode.window.activeTextEditor;
    if (editor && filepath === editor.document.uri.fsPath) {
      const handler = new VerticalDiffHandler(editor, startLine, endLine);
      this.filePathToHandler.set(filepath, handler);
      return handler;
    }
    return undefined;
  }

  async streamEdit(input: string, modelTitle?: string) {
    vscode.commands.executeCommand("setContext", codeAidDiffVisible, true);

    let editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const filepath = editor.document.uri.fsPath;

    let startLine, endLine: number;

    startLine = editor.selection.start.line;
    endLine = editor.selection.end.line;

    const diffHandler = this.createVerticalDiffHandler(
      filepath,
      startLine,
      endLine,
    );
    if (!diffHandler) {
      console.warn("初始化 VerticalDiffHandler 失败");
      return;
    }

    const selectedRange = diffHandler.range;

    const llm = await this.configHandler.llmFromTitle(modelTitle);
    // 选中文本
    const rangeContext = editor.document.getText(selectedRange);
    // 前缀文本
    const prefix = pruneLinesFromTop(
      editor.document.getText(
        new vscode.Range(new vscode.Position(0, 0), selectedRange.start),
      ),
      llm.contentLength / 4,
      llm.model,
    );
    // 后缀文本
    const suffix = pruneLinesFromTop(
      editor.document.getText(
        new vscode.Range(
          selectedRange.end,
          new vscode.Position(editor.document.lineCount, 0),
        ),
      ),
      llm.contentLength / 4,
      llm.model,
    );

    if (editor.selection) {
      editor.selection = new vscode.Selection(
        editor.selection.active,
        editor.selection.active,
      );
    }

    vscode.commands.executeCommand("setContext", codeAidStreamingDiff, true);

    try {
      diffHandler.run(
        streamDiffLines(
          prefix,
          rangeContext,
          suffix,
          llm,
          input,
          getLanguageForFile(filepath),
        ),
      );
    } catch (error) {
    } finally {
      vscode.commands.executeCommand("setContext", codeAidStreamingDiff, false);
    }
  }
}

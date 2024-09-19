import vscode, { InlineCompletionItem, ProviderResult } from "vscode";
import { AutocompleteInput, IDE } from "core";
import { v4 as uuidv4 } from "uuid";
import { CompletionProvider } from "core/autoComplete/completionProvider";
import { ConfigHandler } from "core/config/ConfigHandler";
import { TabAutoCompleteModel } from "../utils/loadAutoCompletionModels";

export class InlineCompletionProvider
  implements vscode.InlineCompletionItemProvider
{
  private completionProvider: CompletionProvider;

  constructor(
    private configHandler: ConfigHandler,
    private ide: IDE,
    private tabAutocompleteModel: TabAutoCompleteModel,
  ) {
    this.completionProvider = new CompletionProvider(
      configHandler,
      ide,
      this.tabAutocompleteModel.get.bind(this.tabAutocompleteModel),
    );
  }

  public async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken,
    // @ts-ignore
  ): ProviderResult<InlineCompletionItem[]> {
    try {
      const selectedCompletionInfo = context.selectedCompletionInfo;
      const startPos = selectedCompletionInfo?.range.start ?? position;
      const completionRange = new vscode.Range(
        startPos,
        startPos.translate(0, 10),
      );

      const abortController = new AbortController();
      const signal = abortController.signal;
      // 取消请求
      token.onCancellationRequested(() => abortController.abort());

      const input: AutocompleteInput = {
        completionId: uuidv4(),
        filepath: document.uri.fsPath,
        pos: position,
      };

      const outcome =
        await this.completionProvider.provideInlineCompletionItems(
          input,
          signal,
        );

      if (!outcome?.completion) return;

      const completionItem = new vscode.InlineCompletionItem(
        outcome?.completion,
      );
      return [completionItem];
    } catch (error) {}
  }
}

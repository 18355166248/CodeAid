import { ConfigHandler } from "../config/ConfigHandler";
import { AutocompleteInput } from "../types/completion.type";
import { LLMOptions } from "../types/config.type";
import { IDE } from "../types/ide.type";

export class CompletionProvider {
  constructor(
    private configHandler: ConfigHandler,
    private ide: IDE,
    private readonly getLlm: () => Promise<LLMOptions | undefined>,
  ) {}

  public async provideInlineCompletionItems(
    input: AutocompleteInput,
    token: AbortSignal,
  ) {
    try {
      const config = await this.configHandler.loadConfig();
      const options = config.tabAutocompleteOptions;
      if (options?.disabled) return undefined;

      const llm = await this.getLlm();
      if (!llm) return undefined;
    } catch (error) {}
  }
}

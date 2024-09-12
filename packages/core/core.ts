import { CompletionProvider } from "./autoComplete/completionProvider";
import { ConfigHandler } from "./config/ConfigHandler";
import { IDE } from "./types/ide.type";

export class Core {
  configHandler: ConfigHandler;
  completionProvider: CompletionProvider;

  constructor(private readonly ide: IDE) {
    this.ide = ide;
    this.configHandler = new ConfigHandler(this.ide);

    this.completionProvider = new CompletionProvider(
      this.configHandler,
      this.ide,
      this.getLlM,
    );
  }

  private async getLlM() {
    const config = await this.configHandler.loadConfig();

    return config.tabAutocompleteModels?.[0];
  }
}

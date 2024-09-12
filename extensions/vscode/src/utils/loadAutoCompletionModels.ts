import { LLMOptions } from "core";
import { ConfigHandler } from "core/config/ConfigHandler";

export class TabAutoCompleteModel {
  private __llm?: LLMOptions;
  private configHandler: ConfigHandler;

  constructor(configHandler: ConfigHandler) {
    this.configHandler = configHandler;
  }

  clearLlm() {
    this.__llm = undefined;
  }

  async get() {
    if (this.__llm) return this.__llm;

    const config = await this.configHandler.loadConfig();
    if (config.tabAutocompleteModels?.length) {
      this.__llm = config.tabAutocompleteModels[0];
      return this.__llm;
    }
  }
}

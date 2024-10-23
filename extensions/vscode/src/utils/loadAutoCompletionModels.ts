import { CLLM } from "core";
import { ConfigHandler } from "core/src/config/ConfigHandler";

export class TabAutoCompleteModel {
  private __llm?: CLLM;
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

import { CompletionProvider } from "./autoComplete/completionProvider";
import { ConfigHandler } from "./config/ConfigHandler";
import { IDE } from "./types/ide.type";
import { Message } from "./types/messager.type";
import { FromCoreProtocol, ToCoreProtocol } from "./types/protocol.type";
import { IMessenger } from "./utils/messenger";

export class Core {
  configHandler: ConfigHandler;
  completionProvider: CompletionProvider;

  constructor(
    private readonly ide: IDE,
    private readonly messenger: IMessenger<ToCoreProtocol, FromCoreProtocol>,
  ) {
    this.ide = ide;
    this.configHandler = new ConfigHandler(this.ide);

    this.completionProvider = new CompletionProvider(
      this.configHandler,
      this.ide,
      this.getLlM,
    );

    const on = this.messenger.on.bind(this.messenger);

    on("llm/streamChat", (msg) => llmStreamChat(this.configHandler, msg));

    async function* llmStreamChat(
      configHandler: ConfigHandler,
      msg: Message<ToCoreProtocol["llm/streamChat"][0]>,
    ) {
      console.log("🚀 ~ Core ~ llmStreamChat msg:", msg);
      const model = await configHandler.llmFromTitle(msg.data.title);
      const gen = model.streamChat(
        msg.data.messages,
        msg.data.completionOptions,
      );
      let next = await gen.next();

      while (!next.done) {
        yield { done: false, content: next.value.content };

        next = await gen.next();
      }
      return { done: true, content: next.value };
    }
  }

  private async getLlM() {
    const config = await this.configHandler.loadConfig();

    return config.tabAutocompleteModels?.[0];
  }
}

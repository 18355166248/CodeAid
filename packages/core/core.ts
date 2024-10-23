import { CompletionProvider } from "./src/autoComplete/completionProvider";
import { ConfigHandler } from "./src/config/ConfigHandler";
import { IDE } from "./src/types/ide.type";
import { Message } from "./src/types/messager.type";
import { FromCoreProtocol, ToCoreProtocol } from "./src/types/protocol.type";
import { IMessenger } from "./src/utils/messenger";

export class Core {
  configHandler: ConfigHandler;
  completionProvider: CompletionProvider;

  private abortedMessageIds: Set<string> = new Set();

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

    on("abort", (msg) => {
      this.abortedMessageIds.add(msg.messageId);
    });
    on("llm/streamChat", (msg) =>
      llmStreamChat(this.configHandler, msg, this.abortedMessageIds),
    );
    on("insertCode", (msg) => {
      const { rangeInFileWithContents } = msg.data;
      this.ide.writeFile(rangeInFileWithContents);
    });

    async function* llmStreamChat(
      configHandler: ConfigHandler,
      msg: Message<ToCoreProtocol["llm/streamChat"][0]>,
      abortedMessageIds: Set<string>,
    ) {
      const model = await configHandler.llmFromTitle(msg.data.title);
      const gen = model.streamChat(
        msg.data.messages,
        msg.data.completionOptions,
      );
      let next = await gen.next();

      while (!next.done) {
        // 判断是否需要暂停请求
        if (abortedMessageIds.has(msg.messageId)) {
          abortedMessageIds.delete(msg.messageId);
          // 结束生成器并允许生成器与 try...finally 块结合使用时执行任何清理任务。
          next = await gen.return({
            prompt: "",
            completion: "",
            modelTitle: model.title ?? model.model,
            completionOptions: {
              ...msg.data.completionOptions,
              model: model.model,
            },
          });
          break;
        }
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

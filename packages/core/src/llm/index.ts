import { ChatMessage, PromptLog, PromptTemplate } from "../types/chat.type";
import {
  CLLM,
  CompletionOptions,
  LLMOptions,
  ModelProvider,
} from "../types/config.type";
import mergeJson from "../utils/merge";
import {
  autodetectPromptTemplate,
  autodetectTemplateFunction,
  autodetectTemplateType,
} from "./autodetect";
import { DEFAULT_CONTEXT_LENGTH, DEFAULT_MAX_TOKENS } from "./constants";
import Handlebars from "handlebars";

export class BaseLLM implements CLLM {
  private _llmOptions: LLMOptions;
  model: string;
  title?: string;
  url?: string;
  completionOptions: CompletionOptions;
  contentLength: number;
  promptTemplates?: Record<string, PromptTemplate>;

  static providerName: ModelProvider;
  get providerName(): ModelProvider {
    return (this.constructor as typeof BaseLLM).providerName;
  }

  constructor(options: LLMOptions) {
    this._llmOptions = options;
    this.model = options.model;
    this.title = options.title;
    this.url = options.url;
    this.contentLength =
      options.completionOptions?.options?.num_ctx || DEFAULT_CONTEXT_LENGTH;
    this.completionOptions = {
      ...options.completionOptions,
      model: options.model || "gpt-4",
      options: {
        ...options.completionOptions?.options,
        num_predict:
          options.completionOptions?.options?.num_predict || DEFAULT_MAX_TOKENS,
      },
    };

    const templateType = options.template ?? autodetectTemplateType(this.model);

    this.promptTemplates = {
      ...autodetectPromptTemplate(this.model, templateType),
      ...options.promptTemplates,
    };
  }

  async *streamComplete(
    _prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    const { completionOptions } = this._parseCompletionOptions(options);

    let completion = "";
    for await (const chunk of this._streamComplete(
      _prompt,
      completionOptions,
    )) {
      completion += chunk;
      yield chunk;
    }
    return {
      completion,
    };
  }

  protected async *_streamComplete(
    _prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    throw new Error("_streamComplete Not implemented");
  }

  protected async *_streamChat(
    messages: ChatMessage[],
    completionOptions: CompletionOptions = {},
    cancelToken?: AbortSignal,
  ): AsyncGenerator<ChatMessage> {
    throw new Error("_streamChat Not implemented");
  }

  async *streamChat(
    messages: ChatMessage[],
    options: CompletionOptions = {},
    cancelToken?: AbortSignal,
  ): AsyncGenerator<ChatMessage, PromptLog> {
    const { completionOptions } = this._parseCompletionOptions(options);
    const prompt = this._formatChatMessages(messages);
    let completion = "";
    try {
      for await (const chunk of this._streamChat(
        messages,
        completionOptions,
        cancelToken,
      )) {
        completion += chunk;
        yield chunk;
      }
    } catch (error) {
      console.log("🚀 ~ BaseLLM ~ streamChat error:", error);
      throw error;
    }
    return {
      prompt,
      completion,
      modelTitle: this.title ?? completionOptions.model ?? "",
      completionOptions,
    };
  }

  getModel(): string {
    return this.model;
  }

  private _formatChatMessages(messages: ChatMessage[]): string {
    const messagesCopy = messages ? messages.map((v) => ({ ...v })) : [];
    let formatStr = "";
    for (const msg of messagesCopy) {
      formatStr += `<${msg.role}>\n${msg.content || ""}\n\n`;
    }

    return formatStr;
  }
  /**
   * 判断当前服务是否支持补全功能
   * @returns 如果支持补全功能则返回true，否则返回false
   */
  supportsCompletions(): boolean {
    if (["deepseek"].includes(this.providerName)) {
      return false;
    }
    return true;
  }
  /**
   * 判断当前provider是否支持预填充功能
   * @returns 如果当前provider支持预填充功能，则返回true；否则返回false
   */
  supportsPrefill(): boolean {
    return ["ollama"].includes(this.providerName);
  }
  /**
   * 渲染提示模板
   *
   * @param template 提示模板，可以是字符串或者函数
   * @param history 历史聊天记录数组
   * @param otherData 其他数据，类型为键值对
   * @param canPutWordsInModelsMouth 是否允许将文字放入模型口中（默认为false）
   * @returns 字符串或聊天消息数组，具体取决于模板类型和执行结果
   */
  public renderPromptTemplate(
    template: PromptTemplate,
    history: ChatMessage[],
    otherData: Record<string, string>,
  ) {
    if (typeof template === "string") {
      const data: any = {
        history: history,
        ...otherData,
      };

      const compiledTemplate = Handlebars.compile(template);
      return compiledTemplate(data);
    }

    const rendered = template(history, {
      ...otherData,
      supportsCompletions: this.supportsCompletions() ? "true" : "false",
      supportsPrefill: this.supportsPrefill() ? "true" : "false",
    });

    if (
      typeof rendered !== "string" &&
      rendered[rendered.length - 1].role === "assistant"
    ) {
      const templateMessages = autodetectTemplateFunction(
        this.model,
        this.providerName,
        autodetectTemplateType(this.model),
      );
      return templateMessages(rendered);
    }

    return rendered;
  }
  private _parseCompletionOptions(options: CompletionOptions) {
    const raw = options.raw ?? false;

    const completionOptions: CompletionOptions = mergeJson(
      this.completionOptions,
      options,
    );

    return { completionOptions, raw };
  }
}

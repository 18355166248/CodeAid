import { BaseLLM } from "..";
import { ChatMessage } from "../../types/chat.type";
import {
  CompletionOptions,
  LLMOptions,
  ModelProvider,
} from "../../types/config.type";
import { fetchWithRequestOptions } from "../../utils/fetchWithOptions";
import { withExponentialBackoff } from "../../utils/withExponentialBackoff";
import { stripImages } from "../images";
import { streamSse } from "../stream";

const CHAT_ONLY_MODELS = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-35-turbo-16k",
  "gpt-35-turbo-0613",
  "gpt-35-turbo",
  "gpt-4-32k",
  "gpt-4-turbo-preview",
  "gpt-4-vision",
  "gpt-4-0125-preview",
  "gpt-4-1106-preview",
  "gpt-4o-mini",
];
const CHAT_MODELS_ENUM: Record<string, { value: string }> = {
  "gpt-4o": {
    value: "azure_openai_gpt_4o",
  },
};

export class OpenAI extends BaseLLM {
  static providerName: ModelProvider = "openchat";

  maxStopWords?: number;

  apiBase?: string;

  constructor(options: LLMOptions) {
    super(options);
  }

  protected _convertMessage(message: ChatMessage) {
    if (typeof message.content === "string") {
      return message;
    } else if (!message.content.some((item) => item.type !== "text")) {
      // If no multi-media is in the message, just send as text
      // for compatibility with OpenAI "compatible" servers
      // that don't support multi-media format
      return {
        ...message,
        content: message.content.map((item) => item.text).join(""),
      };
    }

    const parts = message.content.map((part) => {
      const msg: any = {
        type: part.type,
        text: part.text,
      };

      return msg;
    });
    return {
      ...message,
      content: parts,
    };
  }

  fetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Custom Node.js fetch
    const customFetch = async (input: URL | RequestInfo, init: any) => {
      try {
        const resp = await fetchWithRequestOptions(new URL(input as any), {
          ...init,
        });

        // Error mapping to be more helpful
        if (!resp.ok) {
          let text = await resp.text();

          throw new Error(
            `HTTP ${resp.status} ${resp.statusText} from ${resp.url}\n\n${text}`,
          );
        }

        return resp;
      } catch (e: any) {
        console.log("🚀 ~ Ollama ~ fetch customFetch ~ e:", e);
        throw new Error(e.message);
      }
    };
    return withExponentialBackoff<Response>(
      () => customFetch(url, init) as any,
      5,
      0.5,
    );
  }

  protected async *_streamComplete(
    prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    for await (const chunk of this._streamChat(
      [{ role: "user", content: prompt }],
      options,
    )) {
      yield stripImages(chunk.content);
    }
  }

  private isO1Model(model?: string): boolean {
    return (
      !!model && (model.startsWith("o1-preview") || model.startsWith("o1-mini"))
    );
  }
  protected _convertModelName(model: string): string {
    return CHAT_MODELS_ENUM[model]?.value ?? model;
  }

  private _convertArgs(options: any, messages: ChatMessage[]) {
    const finalOptions: any = {
      messages: messages.map(this._convertMessage),
      model: this._convertModelName(options.model),
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      stream: options.stream ?? true,
      stop:
        // Jan + Azure OpenAI don't truncate and will throw an error
        this.maxStopWords !== undefined
          ? options.stop?.slice(0, this.maxStopWords)
          : options.stop,
    };

    // OpenAI o1-preview and o1-mini:
    if (this.isO1Model(options.model)) {
      // a) use max_completion_tokens instead of max_tokens
      finalOptions.max_completion_tokens = options.maxTokens;
      finalOptions.max_tokens = undefined;

      // b) don't support streaming currently
      finalOptions.stream = false;

      // c) don't support system message
      finalOptions.messages = finalOptions.messages?.filter(
        (message: any) => message?.role !== "system",
      );
    }

    return finalOptions;
  }

  _getHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };
  }
  protected async *_streamChat(
    messages: ChatMessage[],
    options: CompletionOptions = {},
  ): AsyncGenerator<ChatMessage> {
    if (!this.url) {
      throw new Error(
        "OpenAI API URL 没有设置, 请打开本地配置文件设置 models下 title是gpt的url",
      );
    }
    if (CHAT_ONLY_MODELS.includes(options.model!)) {
      const body = this._convertArgs(options, messages);
      body.messages = body.messages.map((m: any) => ({
        ...m,
        content: m.content === "" ? " " : m.content,
      })) as any;

      const response = await this.fetch(this.url ?? "", {
        method: "POST",
        headers: this._getHeaders(),
        body: JSON.stringify(body),
      });
      if (body.stream === false) {
        const data = await response.json();
        yield data.choices[0].message;
        return;
      }
      for await (const value of streamSse(response)) {
        yield value;
      }
    } else {
      throw new Error("OpenAI only supports chat models");
    }
  }
}

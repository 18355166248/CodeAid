import { BaseLLM } from "..";
import {
  CompletionOptions,
  LLMOptions,
  ModelProvider,
} from "../../types/config.type";
import { fetchWithRequestOptions } from "../../utils/fetchWithOptions";
import { withExponentialBackoff } from "../../utils/withExponentialBackoff";
import { streamResponse } from "../stream";

export class Ollama extends BaseLLM {
  static providerName: ModelProvider = "ollama";

  constructor(options: LLMOptions) {
    super(options);
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
        throw new Error(e.message);
      }
    };
    return withExponentialBackoff<Response>(
      () => customFetch(url, init) as any,
      5,
      0.5,
    );
  }

  private _convertArgs(prompt: string, options: CompletionOptions) {
    const finalOptions = {
      prompt,
      model: this.getModel(),
      ...options,
      options: {
        num_predict:
          options.options?.num_predict ||
          this.completionOptions.options?.num_predict,
        num_ctx: this.contextLength,
        ...options.options,
      },
    };

    return finalOptions;
  }

  protected async *_streamComplete(
    _prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    const response = await this.fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this._convertArgs(_prompt, options)),
    });

    let buffer = "";
    for await (const value of streamResponse(response)) {
      console.log("🚀 ~ Ollama ~ forawait ~ value:", value);
      // Append the received chunk to the buffer
      buffer += value;
      // Split the buffer into individual JSON chunks
      const chunks = buffer.split("\n");
      buffer = chunks.pop() ?? "";

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (chunk.trim() !== "") {
          try {
            const j = JSON.parse(chunk);
            if ("response" in j) {
              yield j.response;
            } else if ("error" in j) {
              throw new Error(j.error);
            }
          } catch (e) {
            throw new Error(`Error parsing Ollama response: ${e} ${chunk}`);
          }
        }
      }
    }
  }
}
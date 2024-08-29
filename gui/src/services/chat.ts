import { getStream } from "./fetch.server";
import {
  ChatGpt4oMiniGenerateDto,
  ChatOllamaGenerateDto,
  ChatYiTianMultiModelsDto,
} from "./types";

export function chatOllamaGenerate(data: ChatOllamaGenerateDto["request"]) {
  return getStream({
    url: import.meta.env.VITE_LOCAL_URL + "/api/chat",
    data,
    method: "POST",
    headers: {
      Accept: "text/event-stream",
    },
  });
}

// http://ops.pd.ximalaya.local/llm-proxy/azure-openai/openai/deployments/{model}/chat/completions
// https://yitian.xmly.work/llm-proxy/azure-openai/openai/deployments/{model}/chat/completions
export function chatGpt4oMiniGenerate(
  data: ChatGpt4oMiniGenerateDto["request"],
) {
  return getStream({
    url: `https://yitian.xmly.work/llm-proxy/azure-openai/openai/deployments/gpt-4o-mini/chat/completions`,
    data,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-token": import.meta.env.VITE_ACCESS_TOKEN,
      Accept: "text/event-stream",
    },
  });
}

export function chatYiTianMultiModels(
  data: ChatYiTianMultiModelsDto["request"],
) {
  return getStream({
    url: import.meta.env.VITE_YITIAN_API as string,
    data,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
  });
}

export const chatServices = {
  chatOllamaGenerate,
  chatGpt4oMiniGenerate,
  chatYiTianMultiModels,
} as const satisfies Record<
  "chatOllamaGenerate" | "chatGpt4oMiniGenerate" | "chatYiTianMultiModels",
  unknown
>;

export type ChatServiceKey = keyof typeof chatServices;

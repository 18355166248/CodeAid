import { BaseLLM } from "..";
import { ModelDescription } from "../../types/config.type";
import { Ollama } from "./Ollama";
import { OpenAI } from "./OpenAI";

const LLMs = [Ollama, OpenAI];

export async function llmFromDescription(
  desc: ModelDescription,
): Promise<BaseLLM | undefined> {
  const llm = LLMs.find((v) => v.providerName === desc.provider);

  if (!llm) return undefined;

  return new llm(desc);
}

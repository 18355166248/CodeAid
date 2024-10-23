import { BaseCompletionOptions } from "../types/config.type";

export interface AutocompleteTemplate {
  template: string;
  completionOptions?: BaseCompletionOptions["options"];
}

// https://huggingface.co/stabilityai/stable-code-3b
const stableCodeFimTemplate: AutocompleteTemplate = {
  template: "<fim_prefix>{{{prefix}}}<fim_suffix>{{{suffix}}}<fim_middle>",
  completionOptions: {
    stop: [
      "<fim_prefix>",
      "<fim_suffix>",
      "<fim_middle>",
      "<file_sep>",
      "<|endoftext|>",
      "</fim_middle>",
      "</code>",
    ],
  },
};

// https://huggingface.co/deepseek-ai/deepseek-coder-1.3b-base
const deepseekFimTemplate: AutocompleteTemplate = {
  template:
    "<｜fim▁begin｜>{{{prefix}}}<｜fim▁hole｜>{{{suffix}}}<｜fim▁end｜>",
  completionOptions: {
    stop: [
      "<｜fim▁begin｜>",
      "<｜fim▁hole｜>",
      "<｜fim▁end｜>",
      "//",
      "<｜end▁of▁sentence｜>",
    ],
  },
};

export function getTemplateForModel(model: string): AutocompleteTemplate {
  if (model.includes("deepseek")) return deepseekFimTemplate;

  return stableCodeFimTemplate;
}

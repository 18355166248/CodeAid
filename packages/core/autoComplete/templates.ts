export interface AutocompleteTemplate {
  template: string;
  completionOptions?: { stop: string[] };
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

export function getTemplateForModel(model: string): AutocompleteTemplate {
  return stableCodeFimTemplate;
}

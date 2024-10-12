export const defaultConfig = {
  models: [
    {
      title: "Llama 3",
      provider: "ollama",
      model: "llama3.1",
    },
    {
      title: "gpt-4o",
      provider: "openchat",
      model: "gpt-4o",
    },
  ],
  tabAutocompleteModel: {
    title: "deepseek-coder",
    provider: "ollama",
    model: "deepseek-coder",
  },
};

export const defaultJetbrainsConfig = {
  models: [
    {
      title: "Llama 3",
      provider: "ollama",
      model: "llama3.1",
    },
  ],
  tabAutocompleteModel: {
    title: "deepseek-coder",
    provider: "ollama",
    model: "deepseek-coder",
  },
};

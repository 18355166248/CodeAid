import { ChatMessage } from "core";

export interface ChatOllamaGenerateDto {
  request: {
    model: string;
    messages: ChatMessage[];
  };
  response: {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
  };
}

// {"model":"llama3.1:latest","created_at":"2024-08-25T13:54:03.4603638Z","message":{"role":"assistant","content":"，你"},"done":false}
export interface ChatStreamResponse {
  model: string;
  created_at: string;
  done: boolean;
  message: ChatMessage;
}

export interface ChatGpt4oMiniGenerateDto {
  request: {
    stream?: boolean;
    messages: ChatMessage[];
  };
  response: GptResponse;
}

interface GptResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  system_fingerprint: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface Choice {
  index: number;
  message: ChatMessage;
  logprobs: null;
  finish_reason: string;
}

export interface ChatYiTianMultiModelsDto {
  request: {
    model: string;
    messages: ChatMessage[];
  };
  response: ChatMessage;
}

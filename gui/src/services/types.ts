export interface ChatGenerateDto {
  request: {
    model: string;
    messages: { role: string; content: string }[];
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
  message: { role: string; content: string };
}

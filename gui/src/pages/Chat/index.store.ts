import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import createSelectors from "../../utils/selectors";
import { ChatModelsEnum } from "../../constant/chat.const";
import { ChatMessage, PromptLog } from "core";
import { streamRequest } from "./utils/streamRequest";

type State = {
  requestIng: boolean;
  model: keyof typeof ChatModelsEnum;
  inputValue: string;
  messages: ChatMessage[];
  abort: (() => void) | null; // 停止生成
};

type Action = {
  getChatMessageList: () => ChatMessage[];
  clearMessageList: () => void;
  setState: (cb: (state: State) => void) => void;
  llmStreamChat: () => AsyncGenerator<ChatMessage, PromptLog>;
};

const defaultMessages: ChatMessage[] = [
  {
    role: "user",
    content:
      "你是一名开发工程师, 涉及到Java, javascript类的问题, 请全方面给到解决方案",
  },
];

export const initialState: State = {
  requestIng: false,
  model: "Llama 3", // azure_openai_gpt_4o Llama 3
  inputValue: "",
  messages: [...defaultMessages],
  abort: null,
};

export const useChatStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,
    getChatMessageList: () => {
      return get().messages.slice(1);
    },
    clearMessageList: () => {
      set({
        messages: [...defaultMessages],
      });
    },
    setState: (cb: (state: State) => void) => {
      set(cb);
    },
    llmStreamChat: async function* () {
      const abortController = new AbortController();
      const cancelToken = abortController.signal;
      const { messages, model } = get();
      const response = streamRequest(
        "llm/streamChat",
        {
          messages,
          completionOptions: {},
          title: model,
        },
        cancelToken,
      );

      let n = await response.next();

      while (!n.done) {
        console.log("n.value.content", n.value);
        yield { role: "assistant", content: n.value.content };
        n = await response.next();
      }

      return {
        modelTitle: get().model as string,
        prompt: "",
        completion: "",
        completionOptions: {},
      };
    },
  })),
);

export const ChatSelectors = createSelectors(useChatStore);

export const setChatState = ChatSelectors.use.setState;

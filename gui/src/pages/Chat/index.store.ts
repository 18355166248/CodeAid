import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import createSelectors from "../../utils/selectors";
import { ChatModelsEnum } from "../../constant/chat.const";

type MessageItem = {
  role: string;
  content: string;
  show?: boolean;
  isUser?: boolean;
};

type State = {
  requestIng: boolean;
  model: keyof typeof ChatModelsEnum;
  inputValue: string;
  messages: MessageItem[];
  chatList: unknown[];
  abort: (() => void) | null; // 停止生成
};

type Action = {
  reset(): void;
  getChatMessageList: () => MessageItem[];
  setState: (cb: (state: State) => void) => void;
};

export const initialState: State = {
  requestIng: false,
  model: "llama3.1:latest", // azure_openai_gpt_4o llama3.1:latest
  inputValue: "",
  messages: [
    {
      role: "user",
      content:
        "你是一名开发工程师, 涉及到Java, javascript类的问题, 请全方面给到解决方案",
    },
  ],
  chatList: [],
  abort: null,
};

export const useChatStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,
    getChatMessageList: () => {
      return get().messages.slice(1);
    },
    reset: () => {
      // set({});
    },
    setState: (cb: (state: State) => void) => {
      set(cb);
    },
  })),
);

export const ChatSelectors = createSelectors(useChatStore);

export const setChatState = ChatSelectors.use.setState;

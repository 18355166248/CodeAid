import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import createSelectors from "../../utils/selectors";
import { ChatModelsEnum } from "../../constant/chat.const";
import { ChatMessage } from "core";

type State = {
  requestIng: boolean;
  model: keyof typeof ChatModelsEnum;
  inputValue: string;
  messages: ChatMessage[];
  active: boolean;
};

type Action = {
  getChatMessageList: () => ChatMessage[];
  clearMessageList: () => void;
  setState: (cb: (state: State) => void) => void;
};

const defaultMessages: ChatMessage[] = [
  {
    role: "user",
    content:
      "你是一名开发工程师, 涉及到Java, javascript类的问题, 请全方面给到解决方案, 在我说完这句话后, 请基于我后面的问题开始对话",
  },
];

export const initialState: State = {
  requestIng: false,
  model: "Llama 3", // azure_openai_gpt_4o Llama 3
  inputValue: "",
  messages: [...defaultMessages],
  active: false,
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
  })),
);

export const ChatSelectors = createSelectors(useChatStore);

export const setChatState = ChatSelectors.use.setState;

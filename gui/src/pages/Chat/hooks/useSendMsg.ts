import { ChatModelsEnum } from "../../../constant/chat.const";
import { useChatStore } from "../index.store";
import { chatResponseFormatUtilList } from "../utils/chat.utils";
import { ChatServiceKey, chatServices } from "../../../services/chat";
import useLatest from "../../../hooks/useLatest";

const status = {
  requestIng: false,
};

export const useSendMsg = () => {
  const { model, inputValue, messages, setState, abort, llmStreamChat } =
    useChatStore();
  const messageRef = useLatest(messages);

  function sendMessage(askString?: string) {
    if (status.requestIng) return;

    const currentValue = askString || inputValue;

    const value = currentValue.replace(/^\s+|\n+$/g, "");

    setState((state) => {
      state.inputValue = "";
    });

    if (!value) {
      return;
    }
    const msgs = messageRef.current.concat([
      { role: "user", content: value },
      { role: "user", content: "" },
    ]);

    setState((state) => {
      state.messages = msgs;
      state.requestIng = true;
    });
    status.requestIng = true;

    llmStreamChat();
    return;

    const methodName = ChatModelsEnum[model].serviceMethod as ChatServiceKey;
    const methodType = ChatModelsEnum[model].type;
    const chatMethod = chatServices[methodName];

    chatMethod({
      model,
      messages: msgs,
    }).then(async ({ res, abort }) => {
      setState((state) => {
        state.abort = abort;
      });
      const reader = res?.body?.getReader();
      while (reader) {
        const { done, value } = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const v = decoder.decode(value, {
          stream: true,
        });

        if (done || !v) {
          reset();
          break;
        }

        const { str } = chatResponseFormatUtilList[methodType](v);
        setState((state) => {
          const messageCopy = state.messages;
          messageCopy[messageCopy.length - 1].content += str;

          state.messages = messageCopy;
        });
      }
    });
  }

  function handlerAbort() {
    abort?.();
    reset();
  }

  function reset() {
    setState((state) => {
      state.requestIng = false;
      state.abort = null;
    });
    status.requestIng = false;
  }

  return {
    sendMessage,
    handlerAbort,
  };
};

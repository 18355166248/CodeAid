import { ChatModelsEnum } from "../../../constant/chat.const";
import { useChatStore } from "../index.store";
import { chatResponseFormatUtilList } from "../utils/chat.utils";
import { ChatServiceKey, chatServices } from "../../../services/chat";
import useLatest from "../../../hooks/useLatest";
import { streamRequest } from "../utils/streamRequest";
import { ChatMessage, PromptLog } from "core";

const status = {
  requestIng: false,
};

export const useSendMsg = () => {
  const { model, inputValue, messages, setState, abort } = useChatStore();
  const messageRef = useLatest(messages);

  async function sendMessage(askString?: string) {
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

    const gen = llmStreamChat({ messages, model });
    let next = await gen.next();
    while (!next.done) {
      const content = next.value.content as string;

      setState((state) => {
        const messageCopy = state.messages;
        messageCopy[messageCopy.length - 1].content += content;

        state.messages = messageCopy;
      });

      next = await gen.next();
    }

    status.requestIng = false;
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

async function* llmStreamChat({
  messages,
  model,
}: {
  messages: ChatMessage[];
  model: string;
}): AsyncGenerator<ChatMessage, PromptLog> {
  const abortController = new AbortController();
  const cancelToken = abortController.signal;
  const response = streamRequest(
    "llm/streamChat",
    {
      messages,
      completionOptions: {},
      title: model,
    },
    cancelToken,
  );

  let next = await response.next();

  while (!next.done) {
    yield { role: "user", content: next.value as unknown as string };
    next = await response.next();
  }

  return {
    modelTitle: model,
    prompt: "",
    completion: "",
    completionOptions: {},
  };
}

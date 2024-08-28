import { Button, Input } from "antd";
import "./index.scss";
import { useChatStore } from "../../index.store";
import classNames from "classnames";
import { chatServices, ChatServiceKey } from "../../../../services/chat";
import { KeyboardEvent } from "react";
import { ChatModelsEnum } from "../../../../constant/chat.const";
import { chatResponseFormatUtilList } from "../../utils/chat.utils";

const Footer = () => {
  const { model, inputValue, messages, setState, requestIng, abort } =
    useChatStore();

  function sendMessage() {
    if (requestIng) return;

    const value = inputValue.replace(/^\s+|\n+$/g, "");

    setState((state) => {
      state.inputValue = "";
    });

    if (!value) {
      return;
    }
    const msgs = messages.concat([
      { role: "user", content: value, show: true, isUser: true },
      { role: "user", content: "", show: true },
    ]);

    setState((state) => {
      state.messages = msgs;
      state.requestIng = true;
    });

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

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // 在按下回车键且没有按下shift键的情况下，阻止默认行为 不要换行
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止默认的回车换行行为
    }
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
  }

  return (
    <div className="w-full footer fixed bottom-0 left-0 flex justify-center px-6 backdrop-blur-sm">
      <div className="content bg-white rounded-lg overflow-hidden px-4 pt-4 pb-2 my-4 ">
        <Input.TextArea
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value.trimStart();
            setState((state) => {
              state.inputValue = value;
            });
          }}
          className="input-ans-msg"
          placeholder="请输入聊天内容"
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={sendMessage}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between">
          <span></span>
          <div>
            <div
              onClick={sendMessage}
              className={classNames("send-btn cursor-pointer", {
                "bg-gray-100": !inputValue || requestIng,
                "bg-blue-500": !!inputValue || requestIng,
              })}
            >
              <span
                className={classNames("iconfont icon-a-44tubiao-133", {
                  "text-white": !!inputValue || requestIng,
                })}
              />
            </div>
          </div>
        </div>
      </div>
      {abort ? (
        <div className="abort absolute -top-10 flex justify-center">
          <Button onClick={handlerAbort} danger>
            停止生成
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Footer;

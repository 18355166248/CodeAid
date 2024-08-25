import { Input } from "antd";
import "./index.scss";
import { useChatStore } from "../../index.store";
import classNames from "classnames";
import { chatGenerate } from "../../../../services/chat";
import { ChatStreamResponse } from "../../../../services/types";

const Footer = () => {
  const { model, inputValue, messages, setState, requestIng } = useChatStore();

  function sendMessage() {
    if (requestIng) return;

    const value = inputValue.replace(/^\s+|\n+$/g, "");
    if (!value) {
      setState((state) => {
        state.inputValue = "";
      });
      return;
    }
    const msgs = messages.concat([
      { role: "user", content: value, show: true, isUser: true },
      {
        role: "user",
        content: "",
        show: true,
      },
    ]);

    setState((state) => {
      state.messages = msgs;
      state.requestIng = true;
    });

    chatGenerate({
      model,
      messages: msgs,
    }).then(async (res) => {
      const reader = res?.body?.getReader();
      while (reader) {
        const { done, value } = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const v = decoder.decode(value, {
          stream: true,
        });
        const parseV = JSON.parse(v) as ChatStreamResponse;
        setState((state) => {
          const messageCopy = state.messages;
          messageCopy[messageCopy.length - 1].content += parseV.message.content;

          state.messages = messageCopy;
        });

        if (done) {
          setState((state) => {
            state.requestIng = false;
          });
          break;
        }
      }
    });
  }

  return (
    <div className="w-full footer fixed bottom-6 left-0 flex justify-center px-6">
      <div className="content bg-white rounded-lg overflow-hidden p-4">
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
    </div>
  );
};

export default Footer;

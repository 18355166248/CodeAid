import { Button, Input } from "antd";
import "./index.scss";
import { KeyboardEvent } from "react";
import { useChatStore } from "../../index.store";
import classNames from "classnames";
import { useSendMsg } from "../../hooks/useSendMsg";

const Footer = () => {
  const { inputValue, setState, requestIng, abort } = useChatStore();

  const { sendMessage, handlerAbort } = useSendMsg();

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // 在按下回车键且没有按下shift键的情况下，阻止默认行为 不要换行
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止默认的回车换行行为
    }
  }

  function send() {
    sendMessage();
  }

  return (
    <div className="w-full footer fixed bottom-0 left-0 flex justify-center px-6 backdrop-blur-sm">
      <div className="content relative rounded-lg overflow-hidden py-2 my-4">
        <Input.TextArea
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value.trimStart();
            setState((state) => {
              state.inputValue = value;
            });
          }}
          className="input-ans-msg px-4"
          placeholder="请输入聊天内容"
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={send}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between px-2 relative">
          <span></span>
          <div>
            <div onClick={send} className="send-btn cursor-pointer">
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

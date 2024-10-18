import { useChatStore } from "../index.store";
import MarkdownRenderer from "../../../components/MDX/MarkdownRenderer";
import { useEffect } from "react";
import { MessageContent } from "core";

function Content() {
  const { getChatMessageList, messages } = useChatStore();

  useEffect(() => {
    window.vscode.postMessage(
      {
        messageType: "chatMessageListLength",
        data: messages.length,
      },
      "*",
    );
  }, [messages.length]);

  function getContent(content: MessageContent) {
    if (typeof content === "string") {
      return content;
    }

    return content
      .map((part) => {
        return part.text || "";
      })
      .filter((text) => text !== "")
      .join("");
  }

  return (
    <div className="pt-10 pb-24">
      {getChatMessageList().map((message, index) => {
        const isUser = message.role === "user";
        const isAssistant = message.role === "assistant";
        return (
          <div className="mb-2 bg-[#888888]/10 px-4 py-5" key={index}>
            {/* 机器人图标 */}
            {isAssistant ? (
              <span className="flex">
                <span className="w-6 h-6 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-sm iconfont icon-jiqiren text-green-500 border-2 border-green-500 mr-2"></span>
                @CodeAid
              </span>
            ) : null}

            {/* 用户图标 */}
            {isUser ? (
              <span className="flex">
                <span className="w-6 h-6 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-sm iconfont icon-yonghu text-indigo-500 border-2 border-indigo-500 mr-2"></span>
                你
              </span>
            ) : null}

            {/* 问答内容 */}
            <MarkdownRenderer>{getContent(message.content)}</MarkdownRenderer>
          </div>
        );
      })}
    </div>
  );
}

export default Content;

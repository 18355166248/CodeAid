import { useChatStore } from "../../index.store";
import MarkdownRenderer from "../../../../components/MDX/MarkdownRenderer";
import { useEffect } from "react";

function Content() {
  const { getChatMessageList } = useChatStore();

  useEffect(() => {
    const messageHandler = (event: Event) => {
      console.log("event", event);
    };
    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  return (
    <div className="pt-10 pb-24">
      {getChatMessageList().map((message, index) => {
        return (
          <div className="mb-6 text-black" key={index}>
            {/* 机器人图标 */}
            {!message.isUser ? (
              <span className="bg-slate-50 w-8 h-8 mb-1 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-lg iconfont icon-jiqiren text-green-500 border-2 border-green-500"></span>
            ) : null}

            {/* 用户图标 */}
            {message.isUser ? (
              <span className="bg-slate-50 w-8 h-8 mb-1 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-lg iconfont icon-yonghu text-indigo-500 border-2 border-indigo-500"></span>
            ) : null}

            {/* 问答内容 */}
            {message.isUser ? (
              <div className="bg-slate-50 rounded-lg px-4 flex items-center h-10">
                {message.content}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg">
                <MarkdownRenderer>{message.content}</MarkdownRenderer>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Content;

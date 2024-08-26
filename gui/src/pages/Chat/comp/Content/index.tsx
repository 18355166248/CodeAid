import classNames from "classnames";
import { useChatStore } from "../../index.store";
import MarkdownRenderer from "../../../../components/MDX/MarkdownRenderer";

function Content() {
  const { getChatMessageList } = useChatStore();

  return (
    <div className="pt-10 pb-24 text-sm">
      {getChatMessageList().map((message, index) => {
        return (
          <div className="mb-6 text-black" key={index}>
            <div
              className={classNames("flex", {
                "justify-end": message.isUser,
                "items-center": message.isUser,
              })}
            >
              {/* 机器人图标 */}
              <span
                className={classNames({
                  "bg-slate-50 w-14 h-14 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-2xl":
                    !message.isUser,
                  "iconfont icon-jiqiren text-green-500 border-2 border-green-500":
                    !message.isUser,
                })}
              ></span>

              {/* 问答内容 */}
              {message.isUser ? (
                <span className="bg-slate-50 rounded-lg px-4 mx-3 flex items-center h-10">
                  {message.content}
                </span>
              ) : (
                <span className="bg-slate-50 rounded-lg mx-3 ">
                  <MarkdownRenderer>{message.content}</MarkdownRenderer>
                </span>
              )}

              {/* 用户图标 */}
              <span
                className={classNames({
                  "bg-slate-50 w-14 h-14 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-2xl":
                    message.isUser,
                  "iconfont icon-yonghu text-indigo-500 border-2 border-indigo-500":
                    message.isUser,
                })}
              ></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Content;

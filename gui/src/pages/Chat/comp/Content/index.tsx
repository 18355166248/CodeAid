import classNames from "classnames";
import { useChatStore } from "../../index.store";
import MarkdownRenderer from "../../../../components/MDX/MarkdownRenderer";

function Content() {
  const { getChatMessageList } = useChatStore();

  return (
    <div className="py-10">
      {getChatMessageList().map((message, index) => {
        return (
          <div className="mb-6" key={index}>
            <div
              className={classNames("flex", {
                "justify-end": message.isUser,
              })}
            >
              <span
                className={classNames({
                  "bg-slate-50 w-14 h-14 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0":
                    !message.isUser,
                })}
              >
                {message.isUser ? null : "机器人"}
              </span>
              <span className="bg-slate-50 rounded-lg px-6 py-4 mx-3">
                {message.isUser ? (
                  message.content
                ) : (
                  <MarkdownRenderer>{message.content}</MarkdownRenderer>
                )}
              </span>
              <span
                className={classNames({
                  "bg-slate-50 w-14 h-14 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0":
                    message.isUser,
                })}
              >
                {message.isUser ? "你" : null}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Content;

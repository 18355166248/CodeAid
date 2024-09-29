import { useChatStore } from "../index.store";
import MarkdownRenderer from "../../../components/MDX/MarkdownRenderer";
import { useEffect } from "react";
import { useSendMsg } from "../hooks/useSendMsg";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { App } from "antd";

function Content() {
  const { getChatMessageList, messages, clearMessageList } = useChatStore();
  const { sendMessage } = useSendMsg();
  const { modal, message } = App.useApp();

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.data.messageType === "extension.addComment") {
        sendMessage(
          `给下面这段代码加上中文的文档注释，包括函数参数：\n \`\`\`js \n ${event.data.data}  \n \`\`\` `,
        );
      } else if (event.data.messageType === "extension.generateTest") {
        // 生成单测
        sendMessage(
          `请为下面的函数生成单测：\n \`\`\`js \n ${event.data.data}  \n \`\`\` `,
        );
      } else if (event.data.messageType === "extension.explainCode") {
        // 代码解释
        sendMessage(
          `请解释如下代码：\n \`\`\`js \n ${event.data.data}  \n \`\`\` `,
        );
      } else if (event.data.messageType === "codeAid.cleatChat") {
        modal.confirm({
          title: "会话清空后无法恢复!",
          icon: <ExclamationCircleOutlined />,
          content: "确定要清空会话吗?",
          okText: "确认",
          onOk: () => {
            clearMessageList();
          },
          cancelText: "取消",
        });
      } else {
        // message.error("消息类型错误");
      }
    };

    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  // useEffect(() => {
  //   window.vscode.postMessage(
  //     {
  //       messageType: "chatMessageListLength",
  //       data: messages.length,
  //     },
  //     "*",
  //   );
  // }, [messages.length]);

  return (
    <div className="pt-10 pb-24">
      {getChatMessageList().map((message, index) => {
        return (
          <div className="mb-2 bg-[#888888]/10 px-4 py-5" key={index}>
            {/* 机器人图标 */}
            {!message.isUser ? (
              <span className="flex">
                <span className="w-6 h-6 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-sm iconfont icon-jiqiren text-green-500 border-2 border-green-500 mr-2"></span>
                @CodeAid
              </span>
            ) : null}

            {/* 用户图标 */}
            {message.isUser ? (
              <span className="flex">
                <span className="w-6 h-6 rounded-full flex justify-center items-center overflow-hidden grow-0 shrink-0 text-sm iconfont icon-yonghu text-indigo-500 border-2 border-indigo-500 mr-2"></span>
                你
              </span>
            ) : null}

            {/* 问答内容 */}
            <MarkdownRenderer>{message.content}</MarkdownRenderer>
          </div>
        );
      })}
    </div>
  );
}

export default Content;

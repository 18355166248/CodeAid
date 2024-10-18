import { RangeInFileWithContents } from "core";
import { useSendMsg } from "../pages/Chat/hooks/useSendMsg";
import { useChatStore } from "../pages/Chat/index.store";
import { useWebviewListener } from "./useWebviewListener";
import { App } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function getMessage(
  data: {
    rangeInFileWithContents: RangeInFileWithContents;
    prompt?: string;
  },
  sendMessage: (askString?: string) => Promise<void>,
  prompt: string,
) {
  const { filepath, contents } = data.rangeInFileWithContents;
  const ext = filepath.split(".").pop() ?? "js";
  sendMessage(`${prompt}：\n \`\`\`${ext} \n ${contents}  \n \`\`\` `);
}

export function useSetup() {
  const { model, clearMessageList } = useChatStore();
  const { sendMessage } = useSendMsg();
  const { modal } = App.useApp();

  // 监听消息 不发送消息
  useWebviewListener(
    "extension.addComment",
    async (data) => {
      getMessage(
        data,
        sendMessage,
        "给下面这段代码加上中文的文档注释, 只需要基于我提供的代码进行添加注释, 不需要增加多余代码, 只写注释即可",
      );
    },
    [],
  );
  useWebviewListener(
    "extension.generateTest",
    async (data) => {
      getMessage(data, sendMessage, "请为下面的函数生成单测");
    },
    [],
  );
  useWebviewListener(
    "extension.explainCode",
    async (data) => {
      getMessage(data, sendMessage, "请解释如下代码");
    },
    [],
  );
  useWebviewListener(
    "codeAid.cleatChat",
    async () => {
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
    },
    [],
  );

  // 监听外部消息 并发送消息告知外部值

  // 获取默认的model值通知外部
  useWebviewListener(
    "getDefaultModelTitle",
    async () => {
      return model;
    },
    [model],
    true,
  );
}

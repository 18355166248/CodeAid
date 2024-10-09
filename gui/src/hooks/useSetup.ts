import { useChatStore } from "../pages/Chat/index.store";
import { useWebviewListener } from "./useWebviewListener";

export function useSetup() {
  const { model } = useChatStore();

  // 监听外部消息 并发送消息告知外部值
  useWebviewListener(
    "getDefaultModelTitle",
    async () => {
      return model;
    },
    [model],
  );
}

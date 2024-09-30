import { useChatStore } from "../pages/Chat/index.store";

export function useSetup() {
  const { model } = useChatStore();
}

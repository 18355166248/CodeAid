import { Message, ToWebviewProtocol } from "core";
import { useEffect } from "react";
import { respond } from "../pages/Chat/utils/streamRequest";

export function useWebviewListener<T extends keyof ToWebviewProtocol>(
  messageType: T,
  handler: (data: ToWebviewProtocol[T][0]) => Promise<ToWebviewProtocol[T][1]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[],
  skip?: boolean,
) {
  useEffect(
    () => {
      let listener: {
        (event: { data: Message }): Promise<void>;
      };
      if (!skip) {
        listener = async (event: { data: Message }) => {
          if (event.data.messageType === messageType) {
            const res = await handler(event.data.data);
            respond(messageType, res, event.data.messageId);
          }
        };
        window.addEventListener("message", listener);
      }

      return () => {
        if (listener) {
          window.removeEventListener("message", listener);
        }
      };
    },
    dependencies ? [...dependencies, skip] : [skip],
  );
}

import { ToWebviewProtocol } from "core";

export function useWebviewListener<T extends keyof ToWebviewProtocol>(
  messageType: T,
  handler: (data: ToWebviewProtocol[T][0]) => Promise<ToWebviewProtocol[T][1]>,
  dependencies: any[],
  skip?: boolean,
) {
  
}

import { Message } from "../types/messager.type";
import { IProtocol } from "../types/protocol.type";
import { v4 as uuidv4 } from "uuid";

export interface IMessenger<
  ToProtocol extends IProtocol,
  FromProtocol extends IProtocol,
> {
  onError(callback: (error: Error) => void): this;
  send<T extends keyof FromProtocol>(
    messageType: T,
    data: FromProtocol[T][0],
    messageId?: string,
  ): void;

  on<T extends keyof ToProtocol>(
    messageType: T,
    handler: (
      message: Message<ToProtocol[T][0]>,
    ) => Promise<ToProtocol[T][1]> | ToProtocol[T][1],
  ): void;

  request<T extends keyof FromProtocol>(
    messageType: T,
    data: FromProtocol[T][0],
  ): Promise<FromProtocol[T][1]>;

  invoke<T extends keyof ToProtocol>(
    messageType: T,
    data: ToProtocol[T][0],
    messageId?: string,
  ): Promise<ToProtocol[T][1]>;
}

export class InProcessMessenger<
  ToProtocol extends IProtocol,
  FromProtocol extends IProtocol,
> implements IMessenger<ToProtocol, FromProtocol>
{
  protected myTypeListeners = new Map<
    keyof ToProtocol,
    (message: Message) => any
  >();

  constructor(public messages: string[] = []) {}
  onError(callback: (error: Error) => void): this {
    throw new Error("Method not implemented.");
  }
  send<T extends keyof FromProtocol>(
    messageType: T,
    data: FromProtocol[T][0],
    messageId?: string,
  ): void {
    throw new Error("Method not implemented.");
  }
  on<T extends keyof ToProtocol>(
    messageType: T,
    handler: (
      message: Message<ToProtocol[T][0]>,
    ) => ToProtocol[T][1] | Promise<ToProtocol[T][1]>,
  ): void {
    this.myTypeListeners.set(messageType, handler);
  }
  request<T extends keyof FromProtocol>(
    messageType: T,
    data: FromProtocol[T][0],
  ): Promise<FromProtocol[T][1]> {
    throw new Error("Method not implemented.");
  }
  invoke<T extends keyof ToProtocol>(
    messageType: T,
    data: ToProtocol[T][0],
    messageId?: string,
  ): Promise<ToProtocol[T][1]> {
    throw new Error("Method not implemented.");
  }

  externalRequest<T extends keyof ToProtocol>(
    messageType: T,
    data: ToProtocol[T][0],
    _messageId?: string,
  ): Promise<ToProtocol[T][1]> {
    const messageId = _messageId || uuidv4();
    const listener = this.myTypeListeners.get(messageType);
    if (!listener) {
      throw new Error(`No listener for message type ${String(messageType)}`);
    }
    const response = listener({
      messageType: messageType as string,
      data: data,
      messageId: messageId,
    });
    console.log("🚀 ~ response:", response)
    return Promise.resolve(response);
  }
}

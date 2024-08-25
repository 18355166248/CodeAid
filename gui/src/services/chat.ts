import { getStream } from "./fetch.server";
import { ChatGenerateDto } from "./types";

export function chatGenerate(data: ChatGenerateDto["request"]) {
  return getStream({ url: "/api/chat", data, method: "POST" });
}

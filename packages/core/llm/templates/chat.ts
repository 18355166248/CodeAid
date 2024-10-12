import { ChatMessage } from "../../types/chat.type";

/**
 * 创建一个用于生成聊天消息模板的函数
 * @param systemMessage 处理系统消息的回调函数，接收一个ChatMessage类型的参数，返回一个字符串
 * @param userPrompt 用户消息的前缀字符串
 * @param assistantPrompt 助手消息的前缀字符串
 * @param separator 消息之间的分隔符
 * @param prefix 可选参数，生成的模板字符串的前缀
 * @param emptySystemMessage 可选参数，当第一个消息不是系统消息时，使用此字符串作为系统消息部分的占位符
 * @returns 返回一个函数，该函数接收一个ChatMessage类型的数组作为参数，返回一个由消息模板构成的字符串
 */
function templateFactory(
  systemMessage: (msg: ChatMessage) => string,
  userPrompt: string,
  assistantPrompt: string,
  separator: string,
  prefix?: string,
  emptySystemMessage?: string,
): (msgs: ChatMessage[]) => string {
  return (msgs: ChatMessage[]) => {
    let prompt = prefix ?? "";

    // Skip assistant messages at the beginning
    while (msgs.length > 0 && msgs[0].role === "assistant") {
      msgs.shift();
    }

    if (msgs.length > 0 && msgs[0].role === "system") {
      prompt += systemMessage(msgs.shift()!);
    } else if (emptySystemMessage) {
      prompt += emptySystemMessage;
    }

    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      prompt += msg.role === "user" ? userPrompt : assistantPrompt;
      prompt += msg.content;
      if (i < msgs.length - 1) {
        prompt += separator;
      }
    }

    if (msgs.length > 0 && msgs[msgs.length - 1].role === "user") {
      prompt += separator;
      prompt += assistantPrompt;
    }

    return prompt;
  };
}

function deepseekTemplateMessages(msgs: ChatMessage[]): string {
  let prompt = "";
  let system: string | null = null;
  prompt +=
    "You are an AI programming assistant, utilizing the DeepSeek Coder model, developed by DeepSeek Company, and you only answer questions related to computer science. For politically sensitive questions, security and privacy issues, and other non-computer science questions, you will refuse to answer.\n";

  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i];
    prompt += msg.role === "user" ? "### Instruction:\n" : "### Response:\n";

    if (system && msg.role === "user" && i === msgs.length - 1) {
      prompt += `${system}\n`;
    }

    prompt += `${msg.content}`;

    if (i < msgs.length - 1) {
      prompt += msg.role === "user" ? "\n" : "<|EOT|>\n";
    }
  }

  if (msgs.length > 0 && msgs[msgs.length - 1].role === "user") {
    prompt += "\n";
    prompt += "### Response:\n";
  }

  return prompt;
}

const llama3TemplateMessages = templateFactory(
  (msg: ChatMessage) =>
    `<|begin_of_text|><|start_header_id|>${msg.role}<|end_header_id|>\n${msg.content}<|eot_id|>\n`,
  "<|start_header_id|>user<|end_header_id|>\n",
  "<|start_header_id|>assistant<|end_header_id|>\n",
  "<|eot_id|>",
);

/**
 * OpenChat Template, used by CodeNinja
 * GPT4 Correct User: Hello<|end_of_turn|>GPT4 Correct Assistant: Hi<|end_of_turn|>GPT4 Correct User: How are you today?<|end_of_turn|>GPT4 Correct Assistant:
 */
const openchatTemplateMessages = templateFactory(
  () => "",
  "GPT4 Correct User: ",
  "GPT4 Correct Assistant: ",
  "<|end_of_turn|>",
);

export {
  llama3TemplateMessages,
  deepseekTemplateMessages,
  openchatTemplateMessages,
};

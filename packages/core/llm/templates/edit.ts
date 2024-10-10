// 编辑类的模型的模板

import { PromptTemplate } from "../../types/chat.type";

const deepseekEditPrompt = `### System Prompt
You are an AI programming assistant, utilizing the DeepSeek Coder model, developed by DeepSeek Company, and you only answer questions related to computer science. For politically sensitive questions, security and privacy issues, and other non-computer science questions, you will refuse to answer.
### Instruction:
Rewrite the code to satisfy this request: "{{{userInput}}}"

\`\`\`{{{language}}}
{{{codeToEdit}}}
\`\`\`<|EOT|>
### Response:
Sure! Here's the code you requested:

\`\`\`{{{language}}}
`;

const llama3EditPrompt: PromptTemplate = `<|begin_of_text|><|start_header_id|>user<|end_header_id|>
\`\`\`{{{language}}}
{{{codeToEdit}}}
\`\`\`

Rewrite the above code to satisfy this request: "{{{userInput}}}"<|eot_id|><|start_header_id|>assistant<|end_header_id|>
Sure! Here's the code you requested:
\`\`\`{{{language}}}`;

const gptEditPrompt: PromptTemplate = (_, otherData) => {
  if (otherData?.codeToEdit?.trim().length === 0) {
    return `\
\`\`\`${otherData.language}
${otherData.prefix}[BLANK]${otherData.codeToEdit}${otherData.suffix}
\`\`\`

Above is the file of code that the user is currently editing in. Their cursor is located at the "[BLANK]". They have requested that you fill in the "[BLANK]" with code that satisfies the following request:

"${otherData.userInput}"

Please generate this code. Your output will be only the code that should replace the "[BLANK]", without repeating any of the prefix or suffix, without any natural language explanation, and without messing up indentation. Here is the code that will replace the "[BLANK]":`;
  }

  const paragraphs = [
    "The user has requested a section of code in a file to be rewritten.",
  ];
  if (otherData.prefix?.trim().length > 0) {
    paragraphs.push(`This is the prefix of the file:
\`\`\`${otherData.language}
${otherData.prefix}
\`\`\``);
  }

  if (otherData.suffix?.trim().length > 0) {
    paragraphs.push(`This is the suffix of the file:
\`\`\`${otherData.language}
${otherData.suffix}
\`\`\``);
  }

  paragraphs.push(`This is the code to rewrite:
\`\`\`${otherData.language}
${otherData.codeToEdit}
\`\`\`

The user's request is: "${otherData.userInput}"

Here is the rewritten code:`);

  return paragraphs.join("\n\n");
};

export { deepseekEditPrompt, llama3EditPrompt, gptEditPrompt };

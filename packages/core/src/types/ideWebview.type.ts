import { RangeInFileWithContents } from "./chat.type";

export interface ToWebviewFromIdeOrCoreProtocol {
  getDefaultModelTitle: [undefined, string];
  test: [undefined, undefined];
}

export interface ToWebviewFromIdeProtocol {
  "extension.addComment": [
    {
      rangeInFileWithContents: RangeInFileWithContents;
      prompt?: string;
    },
    void,
  ];
  "extension.generateTest": [
    {
      rangeInFileWithContents: RangeInFileWithContents;
      prompt?: string;
    },
    void,
  ];
  "extension.explainCode": [
    {
      rangeInFileWithContents: RangeInFileWithContents;
      prompt?: string;
    },
    void,
  ];
  "codeAid.cleatChat": [undefined, void];
}

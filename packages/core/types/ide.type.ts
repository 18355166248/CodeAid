export type IdeType = "vscode" | "jetbrains";

export type IdeInfo = {
  type: IdeType;
  name: string;
};

export interface IDE {
  getIdeInfo(): Promise<IdeInfo>;
}
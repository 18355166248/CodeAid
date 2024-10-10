export type DiffLineType = "new" | "old" | "same";

export interface DiffLine {
  type: DiffLineType;
  line: string;
}

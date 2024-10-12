export interface Range {
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  character: number;
}

export type ConfigMergeType = "merge" | "overwrite";

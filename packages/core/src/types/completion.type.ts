import { Position } from "./base.type";

export interface AutocompleteInput {
  completionId: string;
  filepath: string;
  pos: Position;
}

export interface TabAutocompleteOptions {
  disabled: boolean;
}

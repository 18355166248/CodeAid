import { LANGUAGES, Typescript } from "./languages";

export function languageForFilePath(filepath: string) {
  return LANGUAGES[filepath.split(".").slice(-1)[0]] || Typescript;
}

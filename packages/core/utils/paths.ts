import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { IdeType } from "../types/ide.type";
import { defaultConfig, defaultJetbrainsConfig } from "../config/defaults";

// 配置文件全局目录
const CODE_AID_GLOBAL_DIR =
  process.env.CODE_AID_GLOBAL_DIR ?? path.join(os.homedir(), ".code-aid");

export function getCodeAidGlobalPath(): string {
  // mac/linux 下是 ~/.code-aid
  const codeAidPath = CODE_AID_GLOBAL_DIR;
  if (!fs.existsSync(codeAidPath)) {
    fs.mkdirSync(codeAidPath);
  }
  return codeAidPath;
}

export function getConfigJsonPath(idePath: IdeType = "vscode") {
  const p = path.join(getCodeAidGlobalPath(), "config.json");
  if (!fs.existsSync(p)) {
    let config = defaultConfig;
    if (idePath === "jetbrains") {
      config = defaultJetbrainsConfig;
    }
    fs.writeFileSync(p, JSON.stringify(config, null, 2));
  }
  return p;
}

const SEP_REGEX = /[\\/]/;

export function getBasename(filepath: string): string {
  return filepath.split(SEP_REGEX).pop() ?? "";
}

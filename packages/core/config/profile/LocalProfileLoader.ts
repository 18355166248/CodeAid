import {
  CodeAidConfig,
  SerializedCodeAidConfig,
} from "../../types/config.type";
import { IDE, IdeType } from "../../types/ide.type";
import { loadFullConfigNode } from "../../utils/load";
import { getConfigJsonPath } from "../../utils/paths";
import fs from "fs";

export default class LocalProfileLoader {
  ide: IDE;
  constructor(ide: IDE) {
    this.ide = ide;
  }
  async doLoadConfig(): Promise<CodeAidConfig> {
    const ideInfo = await this.ide.getIdeInfo();

    const serializedConfig = await loadSerializedConfig(ideInfo.type);

    const newConfig = await loadFullConfigNode(serializedConfig);
    return newConfig;
  }
}

async function loadSerializedConfig(ideType: IdeType) {
  const configPath = getConfigJsonPath(ideType);
  const content = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(content) as unknown as SerializedCodeAidConfig;
  return config;
}

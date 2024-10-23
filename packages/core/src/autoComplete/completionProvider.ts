import { ConfigHandler } from "../config/ConfigHandler";
import {
  AutocompleteInput,
  TabAutocompleteOptions,
} from "../types/completion.type";
import { CLLM } from "../types/config.type";
import { IDE } from "../types/ide.type";
import { GeneratorReuseManager } from "../utils/generatorReuseManager";
import { getBasename } from "../utils/paths";
import { getRangeInString } from "../utils/ranges";
import { languageForFilePath } from "./constructPrompt";
import { getTemplateForModel } from "./templates";
import Handlebars from "handlebars";

const DOUBLE_NEWLINE = "\n\n";
const WINDOWS_DOUBLE_NEWLINE = "\r\n\r\n";
const SRC_DIRECTORY = "/src/";
const PYTHON_ENCODING = "#- coding: utf-8";
const CODE_BLOCK_END = "```";

const multilineStops: string[] = [DOUBLE_NEWLINE, WINDOWS_DOUBLE_NEWLINE];
const commonStops = [SRC_DIRECTORY, PYTHON_ENCODING, CODE_BLOCK_END];

export class CompletionProvider {
  generatorReuseManager: GeneratorReuseManager;
  constructor(
    private configHandler: ConfigHandler,
    private ide: IDE,
    private readonly getLlm: () => Promise<CLLM | undefined>,
  ) {
    this.generatorReuseManager = new GeneratorReuseManager(
      this.onError.bind(this),
    );
  }

  onError(e: any) {
    console.warn("Error generating autocompletion: ", e);
  }
  public async provideInlineCompletionItems(
    input: AutocompleteInput,
    token: AbortSignal,
  ) {
    try {
      const config = await this.configHandler.loadConfig();
      const options = config.tabAutocompleteOptions;
      if (options?.disabled) return undefined;

      const llm = await this.getLlm();
      if (!llm) return undefined;

      const outcome = await this.getTabCompletion(input, llm, token, options);

      if (!outcome?.completion) return;

      return outcome;
    } catch (error) {}
  }

  async getTabCompletion(
    input: AutocompleteInput,
    llm: CLLM,
    token: AbortSignal,
    options?: Partial<TabAutocompleteOptions>,
  ) {
    const startTime = Date.now();

    const { filepath, pos } = input;
    const fileContents = await this.ide.readFile(filepath);
    const fileLines = fileContents.split("\n");

    // 语言的判断
    const lang = languageForFilePath(filepath);
    const line = fileLines[pos.line] || "";
    for (const endOfLine of lang.endOfLine) {
      // 判断如果光标位置在行尾，则不提供补全
      if (line.endsWith(endOfLine) && pos.character >= line.length) {
        return undefined;
      }
    }

    if (!llm) return;

    // 获取光标前的内容
    const fullPrefix = getRangeInString(fileContents, {
      start: {
        line: 0,
        character: 0,
      },
      end: pos,
    });
    // 获取光标后的内容
    const fullSuffix = getRangeInString(fileContents, {
      start: pos,
      end: {
        line: fileLines.length - 1,
        character: Number.MAX_SAFE_INTEGER,
      },
    });

    const workspaceDirs = await this.ide.getWorkspaceDirs();

    const prefix = fullPrefix;
    const suffix = fullSuffix;

    let prompt = "";
    const filename = getBasename(filepath);
    const reponame = getBasename(workspaceDirs[0] ?? "myproject");

    const { template, completionOptions } = getTemplateForModel(llm.model);

    if (completionOptions && completionOptions.temperature === undefined) {
      completionOptions.temperature = 0.01;
    }

    const compiledTemplate = Handlebars.compile(template);
    prompt = compiledTemplate({
      prefix,
      suffix,
      filename,
      reponame,
      language: lang.name,
    });

    const stop = [
      ...(completionOptions?.stop || []),
      ...multilineStops,
      ...commonStops,
      ...lang.topLevelKeywords.map((word) => `\n${word}`),
    ];

    // https://github.com/ollama/ollama/blob/main/docs/api.md
    const generator = this.generatorReuseManager.getGenerator(
      prefix,
      () =>
        llm.streamComplete(prompt, {
          raw: true,
          keep_alive: 60 * 30, // 30 minutes
          options: {
            temperature: 0.01,
            ...completionOptions,
            stop,
          },
        }),
      false,
    );

    let cancelled = false;
    const generatorWithCancellation = async function* () {
      for await (const update of generator) {
        if (token.aborted) {
          cancelled = true;
          return;
        }
        yield update;
      }
    };

    let completion = "";
    let charGenerator = generatorWithCancellation();
    for await (const update of charGenerator) {
      completion += update;
    }

    return {
      time: Date.now() - startTime,
      completion,
      prefix,
      suffix,
      modelProvider: llm.model,
      modelName: llm.title,
      filepath: input.filepath,
    };
  }
}

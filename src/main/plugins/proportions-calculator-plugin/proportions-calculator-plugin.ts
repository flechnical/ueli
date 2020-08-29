import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { ProportionsCalculatorOptions } from "../../../common/config/proportions-calculator-options";
import { defaultProportionsIcon } from "../../../common/icon/default-icons";
import { ProportionsCalculator } from "./proportions-calculator";

export class ProportionsCalculatorPlugin implements ExecutionPlugin {
  public pluginType = PluginType.ProportionsCalculator;
  private config: ProportionsCalculatorOptions;
  // private translationSet: TranslationSet;
  private readonly clipboardCopier: (value: string) => Promise<void>;

  constructor(
    config: ProportionsCalculatorOptions,
    // translationSet: TranslationSet,
    clipboardCopier: (value: string) => Promise<void>
  ) {
    this.config = config;
    // this.translationSet = translationSet;
    this.clipboardCopier = clipboardCopier;
  }

  public isValidUserInput(userInput: string): boolean {
    return (
      userInput.startsWith(this.config.prefix) &&
      userInput.replace(this.config.prefix, "").length > 0
    );
  }

  public getSearchResults(
    userInput: string,
    fallback?: boolean | undefined
  ): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
      const strippedInput: string = userInput.replace(this.config.prefix, "").replace(/,/g, ".");
      const resultsArray: SearchResultItem[] = [];
      const result: string[] = ProportionsCalculator.calculate(strippedInput).split("|");
      if (this.config.decimalComma && result[2] === "done") result[0] = result[0].replace(/\./g, ",");
      resultsArray.push({
        description: (result[2] === "done") ? `[in ${result[1]}] Press Enter to copy the output.` : "",
        executionArgument: result[0],
        hideMainWindowAfterExecution: true,
        icon: defaultProportionsIcon,
        name: `${result[0]}`,
        originPluginType: this.pluginType,
        searchable: [],
      });
      resolve(resultsArray);
    });
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public execute(
    searchResultItem: SearchResultItem,
    privileged: boolean
  ): Promise<void> {
    return this.clipboardCopier(searchResultItem.executionArgument); // TODO(flechnical): adapt this so it also works with other languages; search for ": "?
  }

  public updateConfig(
    updatedConfig: UserConfigOptions,
    translationSet: TranslationSet
  ): Promise<void> {
    return new Promise((resolve) => {
      this.config = updatedConfig.proportionsCalculatorOptions;
      // this.translationSet = translationSet;
      resolve();
    });
  }
}

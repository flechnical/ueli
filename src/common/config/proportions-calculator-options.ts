export interface ProportionsCalculatorOptions {
  enabled: boolean;
  prefix: string;
  decimalComma: boolean;
}

export const defaultProportionsCalculatorOptions: ProportionsCalculatorOptions = {
  enabled: false,
  prefix: "pr?",
  decimalComma: false,
};

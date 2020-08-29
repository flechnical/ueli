export class ProportionsCalculator {
  public static calculate(input: string): string {
    const stArr: string[] = input.split("/");
    const unit1: string = stArr[0].substr(1);
    const unit2: string = stArr[1];
    const posCorr: boolean = (input[0] === "+" || input[0] === " ") ? true : false;
    switch (stArr.length) {
      case 1:
        return "Enter your base unit -> followed by a '/'||";
      case 2:
        return "Enter your target unit -> followed by a '/'||";
      case 3:
      case 4:
        return `How much/many ${unit1} do you have and how much/many ${unit2} does that make? -> each followed by a '/'||`;
      case 5:
        return `How much/many ${unit1} do you want to know the relating ${unit2} of? -> followed by a '/'||`;
      default:
        if (posCorr) {
          return String(
            (Number(stArr[3]) / Number(stArr[2])) * Number(stArr[4])
          ) + `|${unit2}|done`;
        } else {
          return String(
            (Number(stArr[3]) / Number(stArr[4])) * Number(stArr[2])
          ) + `|${unit2}|done`;
        }
    }
  }
}

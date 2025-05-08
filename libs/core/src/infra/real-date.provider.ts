import { BaseDateProvider, DateProvider } from "../application/date.provider";

export class RealDateProvider extends BaseDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }

  override formatRelative(date: Date) {
    return super.formatRelative(date, this.getNow());
  }
}

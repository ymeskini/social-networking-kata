import { BaseDateProvider, DateProvider } from './date.provider';

export class RealDateProvider extends BaseDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }

  formatRelative(date: Date) {
    return super.formatRelative(date, this.getNow());
  }
}

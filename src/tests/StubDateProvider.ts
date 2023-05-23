import { BaseDateProvider, DateProvider } from '../date.provider';

export class StubDateProvider extends BaseDateProvider implements DateProvider {
  now!: Date;
  getNow() {
    return this.now;
  }

  formatRelative(date: Date) {
    return super.formatRelative(date, this.now);
  }
}

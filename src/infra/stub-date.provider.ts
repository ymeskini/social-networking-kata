import { BaseDateProvider, DateProvider } from '../application/date.provider';

export class StubDateProvider extends BaseDateProvider implements DateProvider {
  now!: Date;
  getNow() {
    return this.now;
  }

  override formatRelative(date: Date) {
    return super.formatRelative(date, this.now);
  }
}

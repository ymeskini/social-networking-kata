import { differenceInSeconds, formatDistance } from 'date-fns';

export abstract class DateProvider {
  abstract getNow(): Date;
  abstract formatRelative(date: Date): string;
}

export class BaseDateProvider {
  formatRelative(date: Date, now: Date) {
    const seconds = differenceInSeconds(now, date);

    if (seconds < 60) {
      return 'less than a minute ago';
    }

    return formatDistance(date, now, { addSuffix: true });
  }
}

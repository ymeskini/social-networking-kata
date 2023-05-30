import { DateProvider } from '../application/date.provider';
import { TimelinePresenter } from '../application/timeline-presenter';
import { TimelineMessage } from '../application/usecases/view-timeline.usecase';
import { Timeline } from '../domain/timeline';

export class DefaultTimelinePresenter implements TimelinePresenter {
  constructor(private readonly dateProvider: DateProvider) {}

  show(timeline: Timeline): TimelineMessage[] {
    const messages = timeline.data;

    return messages.map((message) => ({
      author: message.author,
      text: message.text,
      publicationTime: this.dateProvider.formatRelative(
        new Date(message.publishedAt),
      ),
    }));
  }
}

import { DateProvider } from '../application/date.provider';
import { TimelineMessage } from '../application/usecases/view-timeline.usecase';
import { Message } from './message';

export class Timeline {
  constructor(
    private readonly messages: Message[],
    private readonly dateProvider: DateProvider,
  ) {}

  get data(): TimelineMessage[] {
    return this.messages
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .map((message) => ({
        author: message.author,
        text: message.text,
        publicationTime: this.dateProvider.formatRelative(message.publishedAt),
      }));
  }
}

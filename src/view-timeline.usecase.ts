import { DateProvider } from './date.provider';
import { MessageRepository } from './message.repository';

export type TimelineMessage = {
  author: string;
  text: string;
  publicationTime: string;
};

export class ViewTimelineUseCase {
  constructor(
    private messageRepository: MessageRepository,
    private dateProvider: DateProvider,
  ) {}

  async handle({ user }: { user: string }): Promise<TimelineMessage[]> {
    const messagesOfCurrentUser =
      await this.messageRepository.getMessagesByUser(user);
    return messagesOfCurrentUser
      .sort(
        (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime(),
      )
      .map((msg) => ({
        author: msg.author,
        text: msg.text,
        publicationTime: this.dateProvider.formatRelative(msg.publishedAt),
      }));
  }
}

import { Timeline } from '../../domain/timeline';
import { DateProvider } from '../date.provider';
import { MessageRepository } from '../message.repository';

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

    const timeline = new Timeline(messagesOfCurrentUser, this.dateProvider);
    return timeline.data;
  }
}

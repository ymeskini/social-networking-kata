import { Timeline } from '../../domain/timeline';
import { DateProvider } from '../date.provider';
import { FolloweeRepository } from '../followee.repository';
import { MessageRepository } from '../message.repository';
import { TimelineMessage } from './view-timeline.usecase';

export class ViewWallUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly followeeRepository: FolloweeRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(user: string): Promise<TimelineMessage[]> {
    const followees = await this.followeeRepository.getFolloweesOfUser(user);
    const messages = await Promise.all(
      [user, ...followees].map((user) =>
        this.messageRepository.getMessagesByUser(user),
      ),
    );

    const timeline = new Timeline(messages.flat(), this.dateProvider);
    return timeline.data;
  }
}

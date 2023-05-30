import { Timeline } from '../../domain/timeline';
import { FolloweeRepository } from '../followee.repository';
import { MessageRepository } from '../message.repository';
import { TimelinePresenter } from '../timeline-presenter';

export class ViewWallUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly followeeRepository: FolloweeRepository,
  ) {}

  async handle(
    user: string,
    timelinePresenter: TimelinePresenter,
  ): Promise<void> {
    const followees = await this.followeeRepository.getFolloweesOfUser(user);
    const messages = await Promise.all(
      [user, ...followees].map((user) =>
        this.messageRepository.getMessagesByUser(user),
      ),
    );

    const timeline = new Timeline(messages.flat());
    timelinePresenter.show(timeline);
  }
}

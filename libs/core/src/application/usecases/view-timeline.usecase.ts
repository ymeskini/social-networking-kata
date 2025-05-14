import { Injectable } from "@nestjs/common";
import { Timeline } from "../../domain/timeline";
import { MessageRepository } from "../message.repository";
import { TimelinePresenter } from "../timeline-presenter";

export type TimelineMessage = {
  author: string;
  text: string;
  publicationTime: string;
};

@Injectable()
export class ViewTimelineUseCase {
  constructor(private messageRepository: MessageRepository) {}

  async handle(
    { user }: { user: string },
    timelinePresenter: TimelinePresenter,
  ): Promise<void> {
    const messagesOfCurrentUser =
      await this.messageRepository.getMessagesByUser(user);
    const timeline = new Timeline(messagesOfCurrentUser);

    return timelinePresenter.show(timeline);
  }
}

import { Injectable } from "@nestjs/common";
import { DateProvider } from "./date.provider";
import { TimelinePresenter } from "./timeline-presenter";
import { TimelineMessage } from "./usecases/view-timeline.usecase";
import { Timeline } from "../domain/timeline";

@Injectable()
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

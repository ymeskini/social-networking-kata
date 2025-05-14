import { TimelinePresenter } from "core/application/timeline-presenter";
import { Timeline } from "core/domain/timeline";
import { FastifyReply } from "fastify";

export class ApiTimeLinePresenter implements TimelinePresenter {
  constructor(private readonly res: FastifyReply) {}

  show(timeline: Timeline): void {
    this.res.send(timeline.data);
  }
}

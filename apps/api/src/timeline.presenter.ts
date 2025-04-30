import { TimelinePresenter } from 'libs/core/src/application/timeline-presenter';
import { Timeline } from 'libs/core/src/domain/timeline';
import { FastifyReply } from 'fastify';

export class ApiTimeLinePresenter implements TimelinePresenter {
  constructor(private readonly res: FastifyReply) {}

  show(timeline: Timeline): void {
    this.res.send(timeline.data);
  }
}

import { TimelinePresenter } from 'crafty/crafty/application/timeline-presenter';
import { Timeline } from 'crafty/crafty/domain/timeline';
import { FastifyReply } from 'fastify';

export class ApiTimeLinePresenter implements TimelinePresenter {
  constructor(private readonly res: FastifyReply) {}

  show(timeline: Timeline): void {
    this.res.send(timeline.data);
  }
}

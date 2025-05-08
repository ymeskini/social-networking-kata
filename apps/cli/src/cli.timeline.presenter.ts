import { Timeline } from "libs/core/src/domain/timeline";
import { CustomConsoleLogger } from "./custom.console.logger";
import { DefaultTimelinePresenter } from "./default.timeline.presenter";
import { TimelinePresenter } from "libs/core/src/application/timeline-presenter";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CliTimelinePresenter implements TimelinePresenter {
  constructor(
    private readonly defaultTimelinePresenter: DefaultTimelinePresenter,
    private readonly logger: CustomConsoleLogger
  ) {}
  show(timeline: Timeline): void {
    this.logger.table(this.defaultTimelinePresenter.show(timeline));
  }
}

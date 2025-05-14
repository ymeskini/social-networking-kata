import { Injectable } from "@nestjs/common";

import { Timeline } from "../domain/timeline";

@Injectable()
export abstract class TimelinePresenter {
  abstract show(messages: Timeline): void;
}

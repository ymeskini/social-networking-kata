import { Timeline } from '../domain/timeline';

export interface TimelinePresenter {
  show(messages: Timeline): void;
}

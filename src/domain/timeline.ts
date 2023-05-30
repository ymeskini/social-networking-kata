import { Message } from './message';

export class Timeline {
  constructor(private readonly messages: Message[]) {}

  get data() {
    return this.messages
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .map((message) => message.data);
  }
}

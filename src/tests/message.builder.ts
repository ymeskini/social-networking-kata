import { randomUUID } from 'crypto';
import { Message } from '../message';

export class MessageBuilder {
  private message: Message;
  constructor() {
    this.message = {
      id: 'message-id',
      text: 'some text',
      author: 'Author',
      publishedAt: new Date('2023-02-07T10:40:00.000Z'),
    };
  }

  withId(id: string) {
    this.message.id = id;
    return this;
  }

  withText(text: string) {
    this.message.text = text;
    return this;
  }

  withAuthor(author: string) {
    this.message.author = author;
    return this;
  }

  withPublishedAt(publishedAt: Date) {
    this.message.publishedAt = publishedAt;
    return this;
  }

  build() {
    return this.message;
  }
}

type MessageDirectorProps = {
  text: string;
  publishedAt?: Date;
};
export class MessageDirector {
  createAliceMessage({ text, publishedAt }: MessageDirectorProps) {
    return new MessageBuilder()
      .withAuthor('Alice')
      .withText(text)
      .withId(randomUUID())
      .withPublishedAt(publishedAt || new Date('2023-02-07T10:40:00.000Z'))
      .build();
  }

  createBillMessage({ text, publishedAt }: MessageDirectorProps) {
    return new MessageBuilder()
      .withAuthor('Bill')
      .withText(text)
      .withId(randomUUID())
      .withPublishedAt(publishedAt || new Date('2023-02-07T10:40:00.000Z'))
      .build();
  }
}

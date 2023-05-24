import { UUID, randomUUID } from 'crypto';
import { Message, MessageText } from '../domain/message';

export class MessageBuilder {
  private id = randomUUID();
  private text: MessageText = MessageText.of('Message text');
  private author = 'Author';
  private publishedAt: Date = new Date();

  withId(id: UUID) {
    this.id = id;
    return this;
  }

  withText(text: string) {
    this.text = MessageText.of(text);
    return this;
  }

  withAuthor(author: string) {
    this.author = author;
    return this;
  }

  withPublishedAt(publishedAt: Date) {
    this.publishedAt = publishedAt;
    return this;
  }

  build() {
    const previousId = this.id;
    this.id = randomUUID();
    return new Message(previousId, this.text, this.author, this.publishedAt);
  }
}

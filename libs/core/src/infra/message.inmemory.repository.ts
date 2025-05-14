import { Message } from "../domain/message";
import { MessageRepository } from "../application/message.repository";

export class InMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, Message>();

  async save(msg: Message) {
    this._save(msg);
    return Promise.resolve();
  }

  async getMessageById(messageId: string) {
    return Promise.resolve(this.messages.get(messageId));
  }

  givenExistingMessages = (messages: Message[]) => {
    messages.forEach(this._save);
  };

  getMessagesByUser(userId: string): Promise<Message[]> {
    return Promise.resolve(
      Array.from(this.messages.values()).filter((msg) => msg.author === userId),
    );
  }

  private _save = (msg: Message) => {
    this.messages.set(msg.id, msg);
  };
}

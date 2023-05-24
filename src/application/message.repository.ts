import { Message } from '../domain/message';

export interface MessageRepository {
  save(message: Message): Promise<void>;
  getMessagesByUser(userId: string): Promise<Message[]>;
  getMessageById(messageId: string): Promise<Message>;
}

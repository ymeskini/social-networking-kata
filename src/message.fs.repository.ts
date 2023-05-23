import { join } from 'path';
import { writeFile, readFile } from 'fs/promises';

import { MessageRepository } from './message.repository';
import { Message } from './message';

export class FileSystemMessageRepository implements MessageRepository {
  private readonly FILE_PATH = join(__dirname, 'message.json');

  async save(message: Message): Promise<void> {
    const messages = await this.getMessages();
    const existingMessageIndex = messages.findIndex(
      (msg) => msg.id === message.id,
    );

    if (existingMessageIndex === -1) {
      messages.push(message);
    } else {
      messages[existingMessageIndex] = message;
    }

    return writeFile(this.FILE_PATH, JSON.stringify(messages));
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    const messages = await this.getMessages();
    const messagesOfUser = messages.filter(
      (message: Message) => message.author === userId,
    );

    return messagesOfUser;
  }

  async getMessageById(messageId: string): Promise<Message> {
    const messages = await this.getMessages();
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }
    return message;
  }

  private async getMessages(): Promise<Message[]> {
    const fileContent = await readFile(this.FILE_PATH, 'utf-8');
    const messages = JSON.parse(fileContent) as Message[];

    return messages.map((message) => ({
      ...message,
      publishedAt: new Date(message.publishedAt),
    }));
  }
}

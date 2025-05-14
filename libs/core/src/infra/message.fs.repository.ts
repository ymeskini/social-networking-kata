import { join } from "path";
import { writeFile, readFile } from "fs/promises";

import { MessageRepository } from "../application/message.repository";
import { Message } from "../domain/message";
import { UUID } from "crypto";

export class FileSystemMessageRepository implements MessageRepository {
  constructor(private readonly FILE_PATH = join(__dirname, "message.json")) {}

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

    return writeFile(
      this.FILE_PATH,
      JSON.stringify(messages.map((m) => m.data)),
    );
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
      throw new Error("Message not found");
    }
    return message;
  }

  private async getMessages(): Promise<Message[]> {
    const fileContent = await readFile(this.FILE_PATH, "utf-8");
    const messages = JSON.parse(fileContent) as {
      id: UUID;
      author: string;
      text: string;
      publishedAt: string;
    }[];

    return messages.map((m) =>
      Message.fromData({
        id: m.id,
        author: m.author,
        publishedAt: m.publishedAt,
        text: m.text,
      }),
    );
  }
}

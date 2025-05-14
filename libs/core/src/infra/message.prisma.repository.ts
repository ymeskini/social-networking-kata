import { UUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { MessageRepository } from "../application/message.repository";
import { Message } from "../domain/message";

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(message: Message): Promise<void> {
    const user = { name: message.author };
    await this.prisma.user.upsert({
      where: user,
      update: user,
      create: user,
    });

    const messageValue = {
      id: message.id,
      text: message.text,
      authorId: message.author,
      publishedAt: message.publishedAt,
    };
    await this.prisma.message.upsert({
      where: { id: message.id },
      update: messageValue,
      create: messageValue,
    });
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { authorId: userId },
    });

    return messages.map((msg) =>
      Message.fromData({
        id: msg.id as UUID,
        text: msg.text,
        author: msg.authorId,
        publishedAt: msg.publishedAt.toISOString(),
      }),
    );
  }

  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.prisma.message.findUniqueOrThrow({
      where: { id: messageId },
    });

    return Message.fromData({
      id: message.id as UUID,
      text: message.text,
      author: message.authorId,
      publishedAt: message.publishedAt.toISOString(),
    });
  }
}

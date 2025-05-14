import { Injectable } from "@nestjs/common";
import { Message } from "../domain/message";

// it's possible in typescript to implements an abstract class
@Injectable()
export abstract class MessageRepository {
  abstract save(message: Message): Promise<void>;
  abstract getMessagesByUser(userId: string): Promise<Message[]>;
  abstract getMessageById(messageId: string): Promise<Message>;
}

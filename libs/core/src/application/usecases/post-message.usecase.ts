import { Injectable } from '@nestjs/common';

import { DateProvider } from '../date.provider';
import {
  EmptyMessageError,
  Message,
  MessageTooLongError,
} from '../../domain/message';
import { MessageRepository } from '../message.repository';
import { UUID } from 'crypto';
import { Err, Ok, Result } from '../result';

export type PostMessageCommand = {
  text: string;
  author: string;
  id: UUID;
};

// The use case defines the contract with external dependencies
// and enables dependency injection through the class interface.
@Injectable()
export class PostMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}
  async handle(
    postMessageCommand: PostMessageCommand,
  ): Promise<Result<void, EmptyMessageError | MessageTooLongError>> {
    let message: Message;
    try {
      message = Message.fromData({
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        id: postMessageCommand.id,
        publishedAt: this.dateProvider.getNow().toISOString(),
      });
    } catch (error) {
      return Err.of(error as EmptyMessageError | MessageTooLongError);
    }

    await this.messageRepository.save(message);
    return Ok.of(undefined);
  }
}

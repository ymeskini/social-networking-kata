import { Injectable } from '@nestjs/common';
import { EmptyMessageError, MessageTooLongError } from '../../domain/message';
import { MessageRepository } from '../message.repository';
import { Err } from '../result';
import { Ok } from '../result';
import { Result } from '../result';

export type EditMessageCommand = {
  messageId: string;
  text: string;
};

@Injectable()
export class EditMessageUseCase {
  constructor(private messageRepository: MessageRepository) {}
  async handle(
    editMessageCommand: EditMessageCommand,
    // presenter,
  ): Promise<Result<void, EmptyMessageError | MessageTooLongError>> {
    const message = await this.messageRepository.getMessageById(
      editMessageCommand.messageId,
    );

    try {
      message.editText(editMessageCommand.text);
      await this.messageRepository.save(message);
    } catch (error) {
      // if (error instanceof EmptyMessageError) {
      //   presenter.notifyEmptyMessageError();
      // }
      return Err.of(error as EmptyMessageError | MessageTooLongError);
    }

    return Ok.of(undefined);
  }
}

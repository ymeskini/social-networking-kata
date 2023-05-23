import { MessageRepository } from './message.repository';
import { EmptyMessageError, MessageTooLongError } from './post-message.usecase';

type EditMessageCommand = {
  messageId: string;
  text: string;
};

export class EditMessageUseCase {
  constructor(private messageRepository: MessageRepository) {}
  async handle(editMessageCommand: EditMessageCommand) {
    if (editMessageCommand.text.length > 280) {
      throw new MessageTooLongError();
    }
    if (editMessageCommand.text.trim().length === 0) {
      throw new EmptyMessageError();
    }
    const message = await this.messageRepository.getMessageById(
      editMessageCommand.messageId,
    );
    await this.messageRepository.save({
      ...message,
      text: editMessageCommand.text,
    });
  }
}

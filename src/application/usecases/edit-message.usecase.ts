import { MessageRepository } from '../message.repository';

type EditMessageCommand = {
  messageId: string;
  text: string;
};

export class EditMessageUseCase {
  constructor(private messageRepository: MessageRepository) {}
  async handle(editMessageCommand: EditMessageCommand) {
    const message = await this.messageRepository.getMessageById(
      editMessageCommand.messageId,
    );

    message.editText(editMessageCommand.text);

    await this.messageRepository.save(message);
  }
}

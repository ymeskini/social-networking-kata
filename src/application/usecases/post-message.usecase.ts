import { DateProvider } from '../date.provider';
import { Message } from '../../domain/message';
import { MessageRepository } from '../message.repository';
import { UUID } from 'crypto';

export type PostMessageCommand = {
  text: string;
  author: string;
  id: UUID;
};

// The use case defines the contract with external dependencies
// and enables dependency injection through the class interface.
export class PostMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}
  async handle(postMessageCommand: PostMessageCommand) {
    await this.messageRepository.save(
      Message.fromData({
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        id: postMessageCommand.id,
        publishedAt: this.dateProvider.getNow().toISOString(),
      }),
    );
  }
}

import { DateProvider } from './date.provider';
import { Message } from './message';
import { MessageRepository } from './message.repository';

export type PostMessageCommand = Omit<Message, 'publishedAt'>;

export class MessageTooLongError extends Error {}

export class EmptyMessageError extends Error {}

// le use case détermine le contrat avec les dépandances
// extérieures et ce qui permet l'injection de dépendance
// via l'interface de la classe
class PostMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}
  async handle(postMessageCommand: PostMessageCommand) {
    if (postMessageCommand.text.length > 280) {
      throw new MessageTooLongError();
    }
    if (postMessageCommand.text.trim().length === 0) {
      throw new EmptyMessageError();
    }
    await this.messageRepository.save({
      ...postMessageCommand,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}

export default PostMessageUseCase;

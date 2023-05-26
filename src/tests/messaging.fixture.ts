import { EditMessageUseCase } from '../application/usecases/edit-message.usecase';
import { Message } from '../domain/message';
import {
  PostMessageCommand,
  PostMessageUseCase,
} from '../application/usecases/post-message.usecase';
import {
  TimelineMessage,
  ViewTimelineUseCase,
} from '../application/usecases/view-timeline.usecase';
import { StubDateProvider } from '../infra/stub-date.provider';
import { InMemoryMessageRepository } from '../infra/message.inmemory.repository';

// domain specific language
export const createMessagingFixture = () => {
  let timeline: TimelineMessage[] = [];
  const messageRepository = new InMemoryMessageRepository();
  const stubDateProvider = new StubDateProvider();
  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    stubDateProvider,
  );
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    stubDateProvider,
  );
  const editMessageUseCase = new EditMessageUseCase(messageRepository);
  let thrownError: Error;
  return {
    givenTheFollowingMessagesExist: (messages: Message[]) => {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs: (now: Date) => {
      stubDateProvider.now = now;
    },
    whenUserSeesTheTimelineOf: async (user: string) => {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    thenUserShouldSee: (expectedTimeline: TimelineMessage[]) => {
      expect(timeline).toEqual(expectedTimeline);
    },
    async whenUserPostAMessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageUseCase.handle(postMessageCommand);
      } catch (error) {
        thrownError = error as Error;
      }
    },
    whenUserEditsMessage: async (editMessageCommand: {
      messageId: string;
      text: string;
    }) => {
      try {
        await editMessageUseCase.handle(editMessageCommand);
      } catch (error) {
        thrownError = error as Error;
      }
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
    async thenMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(
        await messageRepository.getMessageById(expectedMessage.id),
      );
    },
    messageRepository,
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;

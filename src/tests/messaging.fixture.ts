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
import { DefaultTimelinePresenter } from '../apps/timeline.default.presenter';
import { TimelinePresenter } from '../application/timeline-presenter';
import { Timeline } from '../domain/timeline';

// domain specific language
export const createMessagingFixture = () => {
  let timeline: TimelineMessage[] = [];

  const messageRepository = new InMemoryMessageRepository();
  const stubDateProvider = new StubDateProvider();
  const timelinePresenter = new DefaultTimelinePresenter(stubDateProvider);
  const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository);
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    stubDateProvider,
  );
  const editMessageUseCase = new EditMessageUseCase(messageRepository);
  let thrownError: Error;
  const timeLinePresenter: TimelinePresenter = {
    show: (theTimeline: Timeline) => {
      timeline = timelinePresenter.show(theTimeline);
    },
  };

  return {
    givenTheFollowingMessagesExist: (messages: Message[]) => {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs: (now: Date) => {
      stubDateProvider.now = now;
    },
    whenUserSeesTheTimelineOf: async (user: string) => {
      await viewTimelineUseCase.handle({ user }, timeLinePresenter);
    },
    thenUserShouldSee: (expectedTimeline: TimelineMessage[]) => {
      expect(timeline).toEqual(expectedTimeline);
    },
    async whenUserPostAMessage(postMessageCommand: PostMessageCommand) {
      const result = await postMessageUseCase.handle(postMessageCommand);
      if (result.isErr()) {
        thrownError = result.error;
      }
    },
    whenUserEditsMessage: async (editMessageCommand: {
      messageId: string;
      text: string;
    }) => {
      const result = await editMessageUseCase.handle(editMessageCommand);
      if (result.isErr()) {
        thrownError = result.error;
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

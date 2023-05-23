import {
  EmptyMessageError,
  MessageTooLongError,
} from '../post-message.usecase';
import { MessageBuilder } from './message.builder';
import { MessagingFixture, createMessagingFixture } from './messaging.fixture';

describe('Feature: Posting a message', () => {
  let fixture: MessagingFixture;
  let messageBuilder: MessageBuilder;

  beforeEach(() => {
    fixture = createMessagingFixture();
    messageBuilder = new MessageBuilder()
      .withAuthor('Alice')
      .withId('message-id');
  });

  describe('Rule: A message can contain a maximum of 280 characters', () => {
    test('Alice can post a message on her timeline', async () => {
      fixture.givenNowIs(new Date('2023-02-07T10:40:00.000Z'));

      await fixture.whenUserPostAMessage({
        id: 'message-id',
        text: 'Hello World',
        author: 'Alice',
      });

      fixture.thenMessageShouldBe(
        messageBuilder
          .withText('Hello World')
          .withPublishedAt(new Date('2023-02-07T10:40:00.000Z'))
          .build(),
      );
    });

    test("Alice can't a message with more than 280 characters", async () => {
      fixture.givenNowIs(new Date('2023-02-07T10:40:00.000Z'));

      await fixture.whenUserPostAMessage({
        id: 'message-id',
        text: 'Hello World'.repeat(100),
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message can't be empty", () => {
    test("Alice can't post an empty message", async () => {
      fixture.givenNowIs(new Date('2023-02-07T10:40:00.000Z'));

      await fixture.whenUserPostAMessage({
        id: 'message-id',
        text: '',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice can't post a message with only spaces", async () => {
      fixture.givenNowIs(new Date('2023-02-07T10:40:00.000Z'));

      await fixture.whenUserPostAMessage({
        id: 'message-id',
        text: ' '.repeat(10),
        author: 'Alice',
      });
    });
  });
});

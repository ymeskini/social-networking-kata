import {
  EmptyMessageError,
  MessageTooLongError,
} from '../post-message.usecase';
import { MessageDirector } from './message.builder';
import { MessagingFixture, createMessagingFixture } from './messaging.fixture';

describe('Feature: editing a message', () => {
  let fixture: MessagingFixture;
  let messageDirectory: MessageDirector;
  beforeEach(() => {
    fixture = createMessagingFixture();
    messageDirectory = new MessageDirector();
  });

  describe('Rule: The edited text should not be superior to 280 characters', () => {
    test('Alice can edit her message to a text inferior to 280 characters', async () => {
      const message = messageDirectory.createAliceMessage({
        text: 'Hello Wrld',
      });

      fixture.givenTheFollowingMessagesExist([message]);

      await fixture.whenUserEditsMessage({
        messageId: message.id,
        text: 'Hello World, my name is Alice and I am 30 years old',
      });

      fixture.thenMessageShouldBe({
        id: message.id,
        text: 'Hello World, my name is Alice and I am 30 years old',
        author: 'Alice',
        publishedAt: new Date('2023-02-07T10:40:00.000Z'),
      });
    });

    test('Alice cannot edit her message to a text superior to 280 characters', async () => {
      const message = messageDirectory.createAliceMessage({
        text: 'Hello Wrld',
      });

      fixture.givenTheFollowingMessagesExist([message]);

      await fixture.whenUserEditsMessage({
        messageId: message.id,
        text: 'Hello World, my name is Alice and I am 30 years old. I am a software engineer and I work at ThoughtWorks'.repeat(
          5,
        ),
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    test('Alice cannot edit a message to an empty text', async () => {
      const message = messageDirectory.createAliceMessage({
        text: 'Hello Wrld',
      });

      fixture.givenTheFollowingMessagesExist([message]);

      await fixture.whenUserEditsMessage({
        messageId: message.id,
        text: '',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

import { EmptyMessageError, MessageTooLongError } from '../domain/message';
import { MessageBuilder } from '../application/message.builder';
import { MessagingFixture, createMessagingFixture } from './messaging.fixture';

describe('Feature: editing a message', () => {
  let fixture: MessagingFixture;
  let aliceMessageBuilder: MessageBuilder;

  beforeEach(() => {
    fixture = createMessagingFixture();
    aliceMessageBuilder = new MessageBuilder().withAuthor('Alice');
  });

  describe('Rule: The edited text should not be superior to 280 characters', () => {
    test('Alice can edit her message to a text inferior to 280 characters', async () => {
      const message = aliceMessageBuilder.withText('Hello Wrld').build();

      fixture.givenTheFollowingMessagesExist([message]);

      await fixture.whenUserEditsMessage({
        messageId: message.id,
        text: 'Hello World, my name is Alice and I am 30 years old',
      });

      fixture.thenMessageShouldBe(
        aliceMessageBuilder
          .withId(message.id)
          .withText('Hello World, my name is Alice and I am 30 years old')
          .build(),
      );
    });

    test('Alice cannot edit her message to a text superior to 280 characters', async () => {
      const message = aliceMessageBuilder.withText('Hello Wrld').build();

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
      const message = aliceMessageBuilder.withText('Hello Wrld').build();

      fixture.givenTheFollowingMessagesExist([message]);

      await fixture.whenUserEditsMessage({
        messageId: message.id,
        text: '',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

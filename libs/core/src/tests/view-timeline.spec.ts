import { MessageBuilder } from '../application/message.builder';
import { MessagingFixture, createMessagingFixture } from './messaging.fixture';

describe('Feature: Viewing a personal timeline', () => {
  let fixture: MessagingFixture;
  let aliceMessageBuilder: MessageBuilder;
  let billMessageBuilder: MessageBuilder;

  beforeEach(() => {
    fixture = createMessagingFixture();
    aliceMessageBuilder = new MessageBuilder().withAuthor('Alice');
    billMessageBuilder = new MessageBuilder().withAuthor('Bill');
  });

  describe('Rule: Messages are shown in reverse chronological order', () => {
    test('Alice can view the 2 messages she published in her timeline', async () => {
      fixture.givenTheFollowingMessagesExist([
        aliceMessageBuilder
          .withText('I love the weather today.')
          .withPublishedAt(new Date('2021-01-01T16:28:00Z'))
          .build(),
        billMessageBuilder
          .withText('Darn! We lost!')
          .withPublishedAt(new Date('2021-01-01T16:29:00Z'))
          .build(),
        aliceMessageBuilder
          .withText('How are you?')
          .withPublishedAt(new Date('2021-01-01T16:29:00Z'))
          .build(),
      ]);

      fixture.givenNowIs(new Date('2021-01-01T16:31:00Z'));
      await fixture.whenUserSeesTheTimelineOf('Alice');
      fixture.thenUserShouldSee([
        {
          author: 'Alice',
          text: 'How are you?',
          publicationTime: '2 minutes ago',
        },
        {
          author: 'Alice',
          text: 'I love the weather today.',
          publicationTime: '3 minutes ago',
        },
      ]);
    });
  });
});

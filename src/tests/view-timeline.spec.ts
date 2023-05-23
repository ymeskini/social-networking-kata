import { MessageDirector } from './message.builder';
import { MessagingFixture, createMessagingFixture } from './messaging.fixture';

describe('Feature: Viewing a personal timeline', () => {
  let fixture: MessagingFixture;
  let messageDirector: MessageDirector;

  beforeEach(() => {
    fixture = createMessagingFixture();
    messageDirector = new MessageDirector();
  });

  describe('Rule: Messages are shown in reverse chronological order', () => {
    test('Alice can view the 2 messages she published in her timeline', async () => {
      fixture.givenTheFollowingMessagesExist([
        messageDirector.createAliceMessage({
          text: 'I love the weather today.',
          publishedAt: new Date('2021-01-01T16:28:00Z'),
        }),
        messageDirector.createBillMessage({
          text: 'Darn! We lost!',
          publishedAt: new Date('2021-01-01T16:29:00Z'),
        }),
        messageDirector.createAliceMessage({
          text: 'How are you?',
          publishedAt: new Date('2021-01-01T16:29:00Z'),
        }),
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

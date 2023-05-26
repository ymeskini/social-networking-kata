import { TimelineMessage } from '../application/usecases/view-timeline.usecase';
import { ViewWallUseCase } from '../application/usecases/view-wall.usecase';
import { InMemoryFolloweeRepository } from '../infra/followee.inmemory.repository';
import { InMemoryMessageRepository } from '../infra/message.inmemory.repository';
import { StubDateProvider } from '../infra/stub-date.provider';
import {
  FollowUserFixture,
  createFollowUserFixture,
} from './following.fixture';
import { MessageBuilder } from './message.builder';
import { MessagingFixture, createMessagingFixture } from './messaging.fixture';

describe("Feature: Viewing a user's wall", () => {
  let fixture: Fixture;
  let messagingFixture: MessagingFixture;
  let messageBuilder: MessageBuilder;
  let followUserFixture: FollowUserFixture;
  beforeEach(() => {
    messagingFixture = createMessagingFixture();
    followUserFixture = createFollowUserFixture();
    messageBuilder = new MessageBuilder();
    fixture = createFixture({
      messageRepository: messagingFixture.messageRepository,
      followeeRepository: followUserFixture.followeeRepository,
    });
  });

  describe('Rule: All the messages from the user and her followees should appear in reverse chronological order', () => {
    test("Charlie has subscribed to Alice's timeline, and view an aggreagated list of all the messages", async () => {
      fixture.givenNowIs(new Date('2020-01-01T00:10:00.000Z'));

      messagingFixture.givenTheFollowingMessagesExist([
        messageBuilder
          .withAuthor('Alice')
          .withText('I love the weather today')
          .withPublishedAt(new Date('2020-01-01T00:00:00.000Z'))
          .build(),
        messageBuilder
          .withAuthor('Charlie')
          .withText('I am in New York today! Anyone wants to have a coffee?')
          .withPublishedAt(new Date('2020-01-01T00:05:00.000Z'))
          .build(),
        messageBuilder
          .withAuthor('Bob')
          .withPublishedAt(new Date('2020-01-01T20:00:00.000Z'))
          .withText('Damn We lost!')
          .build(),
      ]);

      await followUserFixture.givenUserFollowees({
        user: 'Charlie',
        followees: ['Alice'],
      });

      await fixture.whenUserSeesTheWallOf('Charlie');

      fixture.thenUserShouldSee([
        {
          author: 'Charlie',
          text: 'I am in New York today! Anyone wants to have a coffee?',
          publicationTime: '5 minutes ago',
        },
        {
          author: 'Alice',
          text: 'I love the weather today',
          publicationTime: '10 minutes ago',
        },
      ]);
    });
  });
});

const createFixture = ({
  messageRepository,
  followeeRepository,
}: {
  messageRepository: InMemoryMessageRepository;
  followeeRepository: InMemoryFolloweeRepository;
}) => {
  const dateProvider = new StubDateProvider();
  let wall: TimelineMessage[] = [];

  const viewWallUseCase = new ViewWallUseCase(
    messageRepository,
    followeeRepository,
    dateProvider,
  );

  return {
    givenNowIs: (now: Date) => {
      dateProvider.now = now;
    },
    thenUserShouldSee: (expectedWall: TimelineMessage[]) => {
      expect(wall).toEqual(expectedWall);
    },
    whenUserSeesTheWallOf: async (user: string) => {
      wall = await viewWallUseCase.handle(user);
    },
  };
};
type Fixture = ReturnType<typeof createFixture>;

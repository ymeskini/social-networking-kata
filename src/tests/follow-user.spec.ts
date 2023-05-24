import {
  FollowUserCommand,
  FollowUserUseCase,
} from '../application/usecases/follow-user.usecase';
import { InMemoryFolloweeRepository } from '../infra/followee.inmemory.repository';

describe('Feature: Following a user', () => {
  let fixture: FollowUserFixture;
  beforeEach(() => {
    fixture = createFollowUserFixture();
  });

  test('Alice can follow Bob', async () => {
    fixture.givenUserFollowees({
      user: 'Alice',
      followees: ['Charlie'],
    });

    await fixture.whenUserFollowsAnotherUser({
      user: 'Alice',
      userToFollow: 'Bob',
    });

    await fixture.thenUserFolloweesShouldBe({
      user: 'Alice',
      followees: ['Charlie', 'Bob'],
    });
  });
});

const createFollowUserFixture = () => {
  const followeeRepository = new InMemoryFolloweeRepository();
  const followUserUseCase = new FollowUserUseCase(followeeRepository);

  return {
    givenUserFollowees: async ({
      user,
      followees,
    }: {
      user: string;
      followees: string[];
    }) => {
      followeeRepository.givenExistingFollowees(
        followees.map((followee) => ({ user, followee })),
      );
    },
    whenUserFollowsAnotherUser: (followUserCommand: FollowUserCommand) => {
      followUserUseCase.handle(followUserCommand);
    },
    thenUserFolloweesShouldBe: async ({
      user,
      followees,
    }: {
      user: string;
      followees: string[];
    }) => {
      const userFollowees = await followeeRepository.getFolloweesOfUser(user);
      expect(userFollowees).toEqual(followees);
    },
  };
};

type FollowUserFixture = ReturnType<typeof createFollowUserFixture>;

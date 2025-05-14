import {
  FollowUserCommand,
  FollowUserUseCase,
} from "../application/usecases/follow-user.usecase";
import { InMemoryFolloweeRepository } from "../infra/followee.inmemory.repository";

export const createFollowUserFixture = () => {
  const followeeRepository = new InMemoryFolloweeRepository();
  const followUserUseCase = new FollowUserUseCase(followeeRepository);

  return {
    givenUserFollowees: ({
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
    followeeRepository,
  };
};

export type FollowUserFixture = ReturnType<typeof createFollowUserFixture>;

import {
  Followee,
  FolloweeRepository,
} from "../application/followee.repository";

export class InMemoryFolloweeRepository implements FolloweeRepository {
  followeesByUser = new Map<string, string[]>();

  async saveFollowee(followee: Followee): Promise<void> {
    this.addFollowee(followee);
    return Promise.resolve();
  }

  givenExistingFollowees(followees: Followee[]) {
    followees.forEach((followee) => this.addFollowee(followee));
  }

  async getFolloweesOfUser(user: string): Promise<string[]> {
    return Promise.resolve(this.followeesByUser.get(user) ?? []);
  }

  private addFollowee(followee: Followee) {
    const existingFollowees = this.followeesByUser.get(followee.user) ?? [];
    this.followeesByUser.set(followee.user, [
      ...existingFollowees,
      followee.followee,
    ]);
  }
}

export type Followee = {
  user: string;
  followee: string;
};

export interface FolloweeRepository {
  saveFollowee(followee: Followee): Promise<void>;
  getFolloweesOfUser(user: string): Promise<string[]>;
}

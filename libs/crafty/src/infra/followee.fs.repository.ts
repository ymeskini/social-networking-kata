import { join } from 'path';
import {
  Followee,
  FolloweeRepository,
} from '../application/followee.repository';
import { readFile, writeFile } from 'fs/promises';

export class FileSystemFolloweeRepository implements FolloweeRepository {
  constructor(private readonly FILE_PATH = join(__dirname, 'followees.json')) {}

  async saveFollowee(followee: Followee): Promise<void> {
    const followees = await this.getFollowees();
    const followeesOfUser = followees[followee.user] ?? [];

    await writeFile(
      this.FILE_PATH,
      JSON.stringify({
        ...followees,
        [followee.user]: [...followeesOfUser, followee.followee],
      }),
    );
  }

  async getFolloweesOfUser(user: string): Promise<string[]> {
    return this.getFollowees().then((followees) => followees[user] ?? []);
  }

  private async getFollowees(): Promise<Record<string, string[]>> {
    return readFile(this.FILE_PATH).then((data) => JSON.parse(data.toString()));
  }
}

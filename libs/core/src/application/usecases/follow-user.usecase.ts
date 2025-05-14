import { Injectable } from "@nestjs/common";
import { FolloweeRepository } from "../followee.repository";

export type FollowUserCommand = {
  user: string;
  userToFollow: string;
};

@Injectable()
export class FollowUserUseCase {
  constructor(private readonly follloweeRepository: FolloweeRepository) {}

  async handle(followUserCommand: FollowUserCommand) {
    await this.follloweeRepository.saveFollowee({
      user: followUserCommand.user,
      followee: followUserCommand.userToFollow,
    });
  }
}

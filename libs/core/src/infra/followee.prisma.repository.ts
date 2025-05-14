import { PrismaClient } from "../../../../.prisma/client";
import {
  Followee,
  FolloweeRepository,
} from "../application/followee.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaFolloweeRepository implements FolloweeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async saveFollowee(followee: Followee): Promise<void> {
    await this.upsertUser(followee.user);
    await this.upsertUser(followee.followee);
    await this.prisma.user.update({
      where: { name: followee.user },
      data: {
        following: {
          connectOrCreate: {
            where: { name: followee.followee },
            create: { name: followee.followee },
          },
        },
      },
    });
  }

  async getFolloweesOfUser(user: string): Promise<string[]> {
    const currentUser = await this.prisma.user.findUniqueOrThrow({
      where: { name: user },
      include: { following: true },
    });

    return currentUser.following.map((followee) => followee.name);
  }

  private async upsertUser(user: string): Promise<void> {
    await this.prisma.user.upsert({
      where: { name: user },
      update: { name: user },
      create: { name: user },
    });
  }
}

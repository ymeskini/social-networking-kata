import { Module } from "@nestjs/common";
import { CraftyModule } from "core";
import { PrismaMessageRepository } from "core/infra/message.prisma.repository";
import { RealDateProvider } from "core/infra/real-date.provider";
import { PrismaFolloweeRepository } from "core/infra/followee.prisma.repository";
import { PrismaService } from "core/infra/prisma/prisma.service";

import { ApiController } from "./api.controller";

@Module({
  imports: [
    CraftyModule.register({
      MessageRepository: PrismaMessageRepository,
      DateProvider: RealDateProvider,
      FolloweeRepository: PrismaFolloweeRepository,
      PrismaClient: PrismaService,
    }),
  ],
  controllers: [ApiController],
})
export class ApiModule {}

import { Module } from "@nestjs/common";

import { CraftyModule } from "core";
import { PrismaService } from "core/infra/prisma/prisma.service";
import { PrismaFolloweeRepository } from "core/infra/followee.prisma.repository";
import { PrismaMessageRepository } from "core/infra/message.prisma.repository";
import { RealDateProvider } from "core/infra/real-date.provider";

import { commands } from "./commands";
import { CliTimelinePresenter } from "./cli.timeline.presenter";
import { CustomConsoleLogger } from "./custom.console.logger";

@Module({
  imports: [
    CraftyModule.register({
      MessageRepository: PrismaMessageRepository,
      DateProvider: RealDateProvider,
      FolloweeRepository: PrismaFolloweeRepository,
      PrismaClient: PrismaService,
    }),
  ],
  providers: [...commands, CustomConsoleLogger, CliTimelinePresenter],
})
export class CliModule {}

import { Module } from '@nestjs/common';

import { CraftyModule } from 'crafty/crafty';
import { PrismaFolloweeRepository } from 'crafty/crafty/infra/followee.prisma.repository';
import { PrismaMessageRepository } from 'crafty/crafty/infra/message.prisma.repository';
import { RealDateProvider } from 'crafty/crafty/infra/real-date.provider';
import { commands } from './commands';
import { CliTimelinePresenter } from './cli.timeline.presenter';
import { CustomConsoleLogger } from './custom.console.logger';
import { PrismaService } from 'crafty/crafty/infra/prisma/prisma.service';

@Module({
  imports: [
    CraftyModule.register({
      MessageRepository: PrismaMessageRepository,
      DateProvider: RealDateProvider,
      FolloweeRepository: PrismaFolloweeRepository,
      PrismaClient: PrismaService,
    }),
  ],
  providers: [...commands, CliTimelinePresenter, CustomConsoleLogger],
})
export class CliModule {}

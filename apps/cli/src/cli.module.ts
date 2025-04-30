import { Module } from '@nestjs/common';
import { CraftyModule } from 'libs/core/src';
import { PrismaService } from 'libs/core/src/infra/prisma/prisma.service';
import { PrismaFolloweeRepository } from 'libs/core/src/infra/followee.prisma.repository';
import { PrismaMessageRepository } from 'libs/core/src/infra/message.prisma.repository';
import { RealDateProvider } from 'libs/core/src/infra/real-date.provider';

import { commands } from './commands';
import { CliTimelinePresenter } from './cli.timeline.presenter';
import { CustomConsoleLogger } from './custom.console.logger';

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

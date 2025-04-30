import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { CraftyModule } from 'libs/core/src';
import { PrismaMessageRepository } from 'libs/core/src/infra/message.prisma.repository';
import { RealDateProvider } from 'libs/core/src/infra/real-date.provider';
import { PrismaFolloweeRepository } from 'libs/core/src/infra/followee.prisma.repository';
import { PrismaService } from 'libs/core/src/infra/prisma/prisma.service';

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
  providers: [],
})
export class ApiModule {}

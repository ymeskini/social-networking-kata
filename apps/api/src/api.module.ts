import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { CraftyModule } from 'crafty/crafty';
import { PrismaMessageRepository } from 'crafty/crafty/infra/message.prisma.repository';
import { RealDateProvider } from 'crafty/crafty/infra/real-date.provider';
import { PrismaFolloweeRepository } from 'crafty/crafty/infra/followee.prisma.repository';
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
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}

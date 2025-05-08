import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { CraftyModule } from "libs/core/src";
import { PrismaMessageRepository } from "libs/core/src/infra/message.prisma.repository";
import { RealDateProvider } from "libs/core/src/infra/real-date.provider";
import { PrismaFolloweeRepository } from "libs/core/src/infra/followee.prisma.repository";
import { PrismaService } from "libs/core/src/infra/prisma/prisma.service";
import { PostMessageUseCase } from "libs/core/src/application/usecases/post-message.usecase";
import { EditMessageUseCase } from "libs/core/src/application/usecases/edit-message.usecase";
import { FollowUserUseCase } from "libs/core/src/application/usecases/follow-user.usecase";
import { ViewTimelineUseCase } from "libs/core/src/application/usecases/view-timeline.usecase";
import { ViewWallUseCase } from "libs/core/src/application/usecases/view-wall.usecase";
import { MessageRepository } from "libs/core/src/application/message.repository";
import { FolloweeRepository } from "libs/core/src/application/followee.repository";
import { DateProvider } from "libs/core/src/application/date.provider";

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
  providers: [
    PostMessageUseCase,
    EditMessageUseCase,
    FollowUserUseCase,
    ViewTimelineUseCase,
    ViewWallUseCase,
    {
      provide: MessageRepository,
      useClass: PrismaMessageRepository,
    },
    {
      provide: FolloweeRepository,
      useClass: PrismaFolloweeRepository,
    },
    {
      provide: DateProvider,
      useClass: RealDateProvider,
    },
    {
      provide: "PrismaClient",
      useClass: PrismaService,
    },
  ],
})
export class ApiModule {}

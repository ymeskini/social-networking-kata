#!/usr/bin/env node
import { Command } from 'commander';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

// infra
import { RealDateProvider } from '../infra/real-date.provider';
import { PrismaMessageRepository } from '../infra/message.prisma.repository';
import { PrismaFolloweeRepository } from '../infra/followee.prisma.repository';

// usecases
import { EditMessageUseCase } from '../application/usecases/edit-message.usecase';
import {
  PostMessageCommand,
  PostMessageUseCase,
} from '../application/usecases/post-message.usecase';
import { ViewTimelineUseCase } from '../application/usecases/view-timeline.usecase';
import { FollowUserUseCase } from '../application/usecases/follow-user.usecase';
import { ViewWallUseCase } from '../application/usecases/view-wall.usecase';
import { TimelinePresenter } from '../application/timeline-presenter';
import { DefaultTimelinePresenter } from './timeline.default.presenter';
import { Timeline } from '../domain/timeline';

class CliTimeLinePresenter implements TimelinePresenter {
  constructor(
    private readonly defaultTimelinePresenter: DefaultTimelinePresenter,
  ) {}

  show(timeline: Timeline): void {
    console.table(this.defaultTimelinePresenter.show(timeline));
  }
}

const program = new Command();
const prismaClient = new PrismaClient();

const messageRepository = new PrismaMessageRepository(prismaClient);
const followeeRepository = new PrismaFolloweeRepository(prismaClient);
const dateProvider = new RealDateProvider();
const timelinePresenter = new CliTimeLinePresenter(
  new DefaultTimelinePresenter(dateProvider),
);

const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider,
);
const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository);
const editMessageUseCase = new EditMessageUseCase(messageRepository);
const followUserUseCase = new FollowUserUseCase(followeeRepository);
const viewWallUseCase = new ViewWallUseCase(
  messageRepository,
  followeeRepository,
);

const catchAsync = (fn: (...args: any) => Promise<void>) => {
  return (...args: any) => {
    fn(...args).catch((error: Error) => {
      console.error(error);
      process.exit(1);
    });
  };
};

program
  .version('0.0.1')
  .description('A CLI creating new posts')
  .addCommand(
    new Command('post')
      .argument('<user>', 'The current message')
      .argument('<message>', 'The current message')
      .action(
        catchAsync(async (user, message) => {
          const postMessageCommand: PostMessageCommand = {
            id: randomUUID(),
            text: message,
            author: user,
          };
          const result = await postMessageUseCase.handle(postMessageCommand);
          if (result.isOk()) {
            console.log('Message posted');
            process.exit(0);
          }

          throw result.error;
        }),
      ),
  )
  .addCommand(
    new Command('view')
      .argument('<user>', 'The user to filter the messages')
      .action(
        catchAsync(async (user) => {
          await viewTimelineUseCase.handle({ user }, timelinePresenter);
        }),
      ),
  )
  .addCommand(
    new Command('edit')
      .argument('<messageId>', 'The message to edit')
      .argument('<message>', 'The new message')
      .action(
        catchAsync(async (messageId, message) => {
          const result = await editMessageUseCase.handle({
            messageId,
            text: message,
          });

          if (result.isOk()) {
            console.log('Message edited');
            process.exit(0);
          }

          throw result.error;
        }),
      ),
  )
  .addCommand(
    new Command('wall')
      .argument('<user>', 'The user to filter the messages')
      .action(
        catchAsync(async (user) => {
          await viewWallUseCase.handle(user, timelinePresenter);
        }),
      ),
  )
  .addCommand(
    new Command('follow')
      .argument('<user>', 'The current user')
      .argument('<user-to-follow>', 'The user to follow')
      .action(
        catchAsync(async (user, userToFollow) => {
          await followUserUseCase.handle({
            user,
            userToFollow,
          });
          console.log(`${user} is now following ${userToFollow}`);
        }),
      ),
  );

async function main() {
  await prismaClient.$connect();
  await program.parseAsync(process.argv);
  await prismaClient.$disconnect();
}

main();

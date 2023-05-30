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

const program = new Command();
const prismaClient = new PrismaClient();

const messageRepository = new PrismaMessageRepository(prismaClient);
const followeeRepository = new PrismaFolloweeRepository(prismaClient);
const dateProvider = new RealDateProvider();

const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider,
);
const viewTimelineUseCase = new ViewTimelineUseCase(
  messageRepository,
  dateProvider,
);
const editMessageUseCase = new EditMessageUseCase(messageRepository);
const followUserUseCase = new FollowUserUseCase(followeeRepository);
const viewWallUseCase = new ViewWallUseCase(
  messageRepository,
  followeeRepository,
  dateProvider,
);

program
  .version('0.0.1')
  .description('A CLI creating new posts')
  .addCommand(
    new Command('post')
      .argument('<user>', 'The current message')
      .argument('<message>', 'The current message')
      .action(async (user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: randomUUID(),
          text: message,
          author: user,
        };
        try {
          await postMessageUseCase.handle(postMessageCommand);
          console.log('Message posted');
        } catch (error) {
          console.error(error);
        }
      }),
  )
  .addCommand(
    new Command('view')
      .argument('<user>', 'The user to filter the messages')
      .action(async (user) => {
        try {
          const messages = await viewTimelineUseCase.handle({ user });
          console.table(messages);
        } catch (error) {
          console.error(error);
        }
      }),
  )
  .addCommand(
    new Command('edit')
      .argument('<messageId>', 'The message to edit')
      .argument('<message>', 'The new message')
      .action(async (messageId, message) => {
        try {
          await editMessageUseCase.handle({
            messageId,
            text: message,
          });
          console.log('Message edited');
        } catch (error) {
          console.error(error);
        }
      }),
  )

  .addCommand(
    new Command('wall')
      .argument('<user>', 'The user to filter the messages')
      .action(async (user) => {
        try {
          const messages = await viewWallUseCase.handle(user);
          console.table(messages);
        } catch (error) {
          console.error(error);
        }
      }),
  )
  .addCommand(
    new Command('follow')
      .argument('<user>', 'The current user')
      .argument('<user-to-follow>', 'The user to follow')
      .action(async (user, userToFollow) => {
        try {
          await followUserUseCase.handle({
            user,
            userToFollow,
          });
          console.log(`${user} is now following ${userToFollow}`);
        } catch (error) {
          console.error(error);
        }
      }),
  );

async function main() {
  await prismaClient.$connect();
  await program.parseAsync(process.argv);
  await prismaClient.$disconnect();
}

main();

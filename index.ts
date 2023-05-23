#!/usr/bin/env node
import { Command } from 'commander';
import { randomUUID } from 'crypto';

import PostMessageUseCase, {
  PostMessageCommand,
} from './src/post-message.usecase';
import { FileSystemMessageRepository } from './src/message.fs.repository';
import { RealDateProvider } from './src/real-date-provider';
import { ViewTimelineUseCase } from './src/view-timeline.usecase';
import { EditMessageUseCase } from './src/edit-message.usecase';

const program = new Command();

const messageRepository = new FileSystemMessageRepository();
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
  );

program.parse(process.argv);

import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';
import { promisify } from 'util';
import { exec } from 'child_process';
import { PrismaClient } from '@prisma/client';

import { PrismaMessageRepository } from '../infra/message.prisma.repository';
import { MessageBuilder } from './message.builder';

const asyncExec = promisify(exec);

describe('MessagePrismaRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let messageBuilder: MessageBuilder;

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    const connectionUri = container.getConnectionUri();

    prismaClient = new PrismaClient({
      datasources: { db: { url: connectionUri } },
    });

    await asyncExec(
      `DATABASE_URL=prisma+${connectionUri} npx prisma migrate deploy`,
    );
    await prismaClient.$connect();
  }, 30000);

  afterAll(async () => {
    await container.stop();
    await prismaClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaClient.message.deleteMany();
    await prismaClient.user.deleteMany();
    messageBuilder = new MessageBuilder();
  });

  test('should save a message', async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);
    const insertMessage = messageBuilder
      .withAuthor('Alice')
      .withText('Hello World!')
      .withPublishedAt(new Date('2021-01-01T00:00:00.000Z'))
      .build();

    await messageRepository.save(insertMessage);

    const message = await prismaClient.message.findUnique({
      where: { id: insertMessage.id },
    });

    expect(message).toEqual({
      authorId: 'Alice',
      text: 'Hello World!',
      id: insertMessage.id,
      publishedAt: insertMessage.publishedAt,
    });
  });

  test('should update a message', async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);
    const aliceMessageBuilder = messageBuilder
      .withAuthor('Alice')
      .withText('Hello World!')
      .withPublishedAt(new Date('2021-01-01T00:00:00.000Z'));

    const createdMessage = aliceMessageBuilder.build();
    const updatedMessage = aliceMessageBuilder
      .withText('Hello World 2!')
      .withId(createdMessage.id)
      .build();

    await messageRepository.save(createdMessage);

    await messageRepository.save(updatedMessage);

    const message = await prismaClient.message.findUnique({
      where: { id: createdMessage.id },
    });

    expect(message).toEqual({
      authorId: 'Alice',
      text: 'Hello World 2!',
      id: createdMessage.id,
      publishedAt: createdMessage.publishedAt,
    });
  });

  test('should find a message by id', async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);
    const insertMessage = messageBuilder
      .withAuthor('Alice')
      .withText('Hello World!')
      .withPublishedAt(new Date('2021-01-01T00:00:00.000Z'))
      .build();

    await messageRepository.save(insertMessage);

    const message = await messageRepository.getMessageById(insertMessage.id);

    expect(message).toEqual(insertMessage);
  });

  test('should find all messages', async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);
    const aliceMessageBuilder = messageBuilder
      .withAuthor('Alice')
      .withText('Hello World!')
      .withPublishedAt(new Date('2021-01-01T00:00:00.000Z'));

    const bobMessageBuilder = new MessageBuilder()
      .withAuthor('Bob')
      .withText('Hello World! Heeey!')
      .withPublishedAt(new Date('2021-01-01T00:00:00.000Z'));

    const aliceMessage = aliceMessageBuilder.build();
    await Promise.all([
      messageRepository.save(aliceMessage),
      messageRepository.save(bobMessageBuilder.build()),
    ]);

    const messages = await messageRepository.getMessagesByUser('Alice');

    expect(messages).toEqual([aliceMessage]);
  });
});

import { join } from 'path';
import { writeFile, unlink, readFile } from 'fs/promises';

import { FileSystemMessageRepository } from '../infra/message.fs.repository';
import { MessageBuilder } from './message.builder';
import { randomUUID } from 'crypto';

const testMessagesPath = join(__dirname, 'test-messages.json');

describe('FileSystemMessageRepository', () => {
  const messageBuilder = new MessageBuilder();

  beforeEach(async () => {
    await writeFile(testMessagesPath, JSON.stringify([]));
  });

  afterEach(async () => {
    try {
      await unlink(testMessagesPath);
    } catch (error) {
      // ignore error
    }
  });

  test('save() should save a message', async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);
    const id = randomUUID();
    await messageRepository.save(
      messageBuilder
        .withAuthor('Alice')
        .withId(id)
        .withPublishedAt(new Date('2023-02-07T10:40:00.000Z'))
        .withText('Hello World')
        .build(),
    );

    const messageData = await readFile(testMessagesPath, 'utf-8');
    const messages = JSON.parse(messageData);
    expect(messages).toEqual([
      {
        id: id,
        text: 'Hello World',
        publishedAt: '2023-02-07T10:40:00.000Z',
        author: 'Alice',
      },
    ]);
  });

  test('save() can update a message', async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);
    const id = randomUUID();
    await writeFile(
      testMessagesPath,
      JSON.stringify([
        {
          id: id,
          text: 'Hello World',
          publishedAt: '2023-02-07T10:40:00.000Z',
          author: 'Alice',
        },
      ]),
    );
    await messageRepository.save(
      messageBuilder
        .withAuthor('Alice')
        .withId(id)
        .withPublishedAt(new Date('2023-02-07T10:40:00.000Z'))
        .withText('Hello Edited World')
        .build(),
    );

    const messageData = await readFile(testMessagesPath, 'utf-8');
    const messages = JSON.parse(messageData);
    expect(messages).toEqual([
      {
        id: id,
        text: 'Hello Edited World',
        publishedAt: '2023-02-07T10:40:00.000Z',
        author: 'Alice',
      },
    ]);
  });

  test('getById should return the correct message', async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);
    const id = randomUUID();
    await writeFile(
      testMessagesPath,
      JSON.stringify([
        {
          id: id,
          text: 'This is it!!!',
          publishedAt: '2023-02-07T10:40:00.000Z',
          author: 'Bobby',
        },
        {
          id: '123',
          text: 'WooooooW!',
          publishedAt: '2023-02-07T11:40:00.000Z',
          author: 'Alice',
        },
      ]),
    );

    const message = await messageRepository.getMessageById(id);

    expect(message).toEqual(
      messageBuilder
        .withAuthor('Bobby')
        .withId(id)
        .withPublishedAt(new Date('2023-02-07T10:40:00.000Z'))
        .withText('This is it!!!')
        .build(),
    );
  });

  test('getMessagesByUser() should return all messages of a user', async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);
    const firstId = randomUUID();
    const secondId = randomUUID();
    await writeFile(
      testMessagesPath,
      JSON.stringify([
        {
          id: 'id',
          text: 'This is it!!!',
          publishedAt: '2023-02-07T10:40:00.000Z',
          author: 'Bobby',
        },
        {
          id: firstId,
          text: 'WooooooW!',
          publishedAt: '2023-02-07T11:40:00.000Z',
          author: 'Alice',
        },
        {
          id: secondId,
          text: 'WooooooW! HaaaaaH',
          publishedAt: '2023-02-08T11:40:00.000Z',
          author: 'Alice',
        },
      ]),
    );

    const aliceMessages = await messageRepository.getMessagesByUser('Alice');

    expect(aliceMessages).toHaveLength(2);

    expect(aliceMessages).toEqual([
      messageBuilder
        .withAuthor('Alice')
        .withId(firstId)
        .withPublishedAt(new Date('2023-02-07T11:40:00.000Z'))
        .withText('WooooooW!')
        .build(),
      messageBuilder
        .withAuthor('Alice')
        .withId(secondId)
        .withPublishedAt(new Date('2023-02-08T11:40:00.000Z'))
        .withText('WooooooW! HaaaaaH')
        .build(),
    ]);
  });
});

import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import httpErrors from 'http-errors';

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
import {
  FollowUserCommand,
  FollowUserUseCase,
} from '../application/usecases/follow-user.usecase';
import { ViewWallUseCase } from '../application/usecases/view-wall.usecase';

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

const fastify = Fastify({ logger: true });
const routes = async (fastifyInstance: FastifyInstance) => {
  fastifyInstance.post<{ Body: { user: string; message: string } }>(
    '/post',
    async (request, reply) => {
      const postMessageCommand: PostMessageCommand = {
        id: randomUUID(),
        text: request.body.message,
        author: request.body.user,
      };
      try {
        await postMessageUseCase.handle(postMessageCommand);
        reply.status(201);
      } catch (error) {
        console.error(error);
        reply.send(httpErrors[500](error as string));
      }
    },
  );

  fastifyInstance.post<{ Body: { messageId: string; message: string } }>(
    '/edit',
    async (request, reply) => {
      try {
        await editMessageUseCase.handle({
          messageId: request.body.messageId,
          text: request.body.message,
        });
        reply.status(204);
      } catch (error) {
        console.error(error);
        reply.send(httpErrors[500](error as string));
      }
    },
  );

  fastifyInstance.post<{ Body: { user: string; followee: string } }>(
    '/follow',
    async (request, reply) => {
      const followUserCommand: FollowUserCommand = {
        user: request.body.user,
        userToFollow: request.body.followee,
      };
      try {
        await followUserUseCase.handle(followUserCommand);
        reply.status(204);
      } catch (error) {
        console.error(error);
        reply.send(httpErrors[500](error as string));
      }
    },
  );

  fastifyInstance.post<{ Body: { user: string } }>(
    '/view',
    async (request, reply) => {
      try {
        const messages = await viewTimelineUseCase.handle({
          user: request.body.user,
        });
        reply.send(messages);
      } catch (error) {
        console.error(error);
        reply.send(httpErrors[500](error as string));
      }
    },
  );

  fastifyInstance.post<{ Body: { user: string } }>(
    '/wall',
    async (request, reply) => {
      try {
        const wall = await viewWallUseCase.handle(request.body.user);
        reply.send(wall);
      } catch (error) {
        console.error(error);
        reply.send(httpErrors[500](error as string));
      }
    },
  );
};

fastify.register(routes);

fastify.addHook('onClose', async () => {
  await prismaClient.$disconnect();
});

async function main() {
  try {
    await prismaClient.$connect();
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();

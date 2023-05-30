import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance, FastifyReply } from 'fastify';
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
import { TimelinePresenter } from '../application/timeline-presenter';
import { Timeline } from '../domain/timeline';

class ApiTimeLinePresenter implements TimelinePresenter {
  constructor(private readonly reply: FastifyReply) {}
  show(timeline: Timeline): void {
    this.reply.status(200).send(timeline.data);
  }
}

const prismaClient = new PrismaClient();

const messageRepository = new PrismaMessageRepository(prismaClient);
const followeeRepository = new PrismaFolloweeRepository(prismaClient);
const dateProvider = new RealDateProvider();
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
        const result = await postMessageUseCase.handle(postMessageCommand);
        if (result.isOk()) {
          reply.status(201);
          return;
        }
        reply.send(httpErrors[400](result.error.message));
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
        const result = await editMessageUseCase.handle({
          messageId: request.body.messageId,
          text: request.body.message,
        });
        if (result.isOk()) {
          reply.status(204);
          return;
        }
        reply.send(httpErrors[400](result.error.message));
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
      const timelinePresenter = new ApiTimeLinePresenter(reply);
      try {
        await viewTimelineUseCase.handle(
          {
            user: request.body.user,
          },
          timelinePresenter,
        );
      } catch (error) {
        console.error(error);
        reply.send(httpErrors[500](error as string));
      }
    },
  );

  fastifyInstance.post<{ Body: { user: string } }>(
    '/wall',
    async (request, reply) => {
      const timelinePresenter = new ApiTimeLinePresenter(reply);
      try {
        await viewWallUseCase.handle(request.body.user, timelinePresenter);
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

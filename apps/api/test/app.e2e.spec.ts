import { promisify } from "node:util";
import { exec } from "node:child_process";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import * as request from "supertest";
import { PrismaClient } from "@prisma/client";

import { MessageBuilder } from "core/application/message.builder";
import { StubDateProvider } from "core/infra/stub-date.provider";
import { DateProvider } from "core/application/date.provider";
import { PrismaMessageRepository } from "core/infra/message.prisma.repository";
import { ApiModule } from "../src/api.module";

const asyncExec = promisify(exec);

describe("Api (e2e)", () => {
  jest.setTimeout(60000);

  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let app: INestApplication;

  const now = new Date("2023-02-14T19:00:00.000Z");
  const dateProvider = new StubDateProvider();
  dateProvider.now = now;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase("crafty")
      .withUsername("crafty")
      .withPassword("crafty")
      .withExposedPorts(5432)
      .start();

    process.env.DATABASE_URL = `postgresql://crafty:crafty@${container.getHost()}:${container.getMappedPort(
      5432
    )}/crafty`;

    await asyncExec("npx prisma migrate deploy");

    prismaClient = new PrismaClient();
    return prismaClient.$connect();
  });

  afterAll(async () => {
    await prismaClient.$executeRawUnsafe("DROP DATABASE IF EXISTS crafty;");
    await container.stop({ timeout: 1000 });
    return prismaClient.$disconnect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    })
      .overrideProvider(DateProvider)
      .useValue(dateProvider)
      .overrideProvider(PrismaClient)
      .useValue(prismaClient)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    await prismaClient.message.deleteMany();
    await prismaClient.$executeRawUnsafe('DELETE FROM "User" CASCADE');
  });

  it("/post (POST)", async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);

    await request(app.getHttpServer())
      .post("/post")
      .send({ user: "Alice", message: "Message from api test" })
      .expect(201);

    const aliceMessages = await messageRepository.getMessagesByUser("Alice");
    expect(aliceMessages[0].data).toEqual({
      id: expect.any(String),
      author: "Alice",
      text: "Message from api test",
      publishedAt: now.toISOString(),
    });
  });

  it("/view (GET)", async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);

    await messageRepository.save(
      new MessageBuilder()
        .withAuthor("Alice")
        .withPublishedAt(now)
        .withText("Message Test View Api")
        .build()
    );

    await request(app.getHttpServer())
      .post("/view")
      .send({ user: "Alice" })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual([
          {
            id: expect.any(String),
            author: "Alice",
            text: "Message Test View Api",
            publishedAt: now.toISOString(),
          },
        ]);
      });
  });
});

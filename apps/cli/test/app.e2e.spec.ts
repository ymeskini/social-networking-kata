import { exec } from "node:child_process";
import { promisify } from "node:util";
import { TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { CommandTestFactory } from "nest-commander-testing";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

import { CliModule } from "../src/cli.module";
import { StubDateProvider } from "libs/core/src/infra/stub-date.provider";
import { DateProvider } from "libs/core/src/application/date.provider";
import { PrismaMessageRepository } from "libs/core/src/infra/message.prisma.repository";
import { MessageBuilder } from "libs/core/src/tests/message.builder";

const asyncExec = promisify(exec);

describe("Cli App (e2e)", () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let commandInstance: TestingModule;
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
    // Ensure we use the postgresql:// protocol
    const databaseUrl = `postgresql://crafty:crafty@${container.getHost()}:${container.getMappedPort(
      5432
    )}/crafty?schema=public`;
    prismaClient = new PrismaClient();
    await asyncExec(`DATABASE_URL=${databaseUrl} npx prisma migrate deploy`);
    vi.stubEnv("DATABASE_URL", databaseUrl);

    return prismaClient.$connect();
  }, 10000);

  beforeEach(async () => {
    vi.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [CliModule],
    })
      .overrideProvider(DateProvider)
      .useValue(dateProvider)
      .overrideProvider(PrismaClient)
      .useValue(prismaClient)
      .compile();
    await prismaClient.message.deleteMany();
    await prismaClient.$executeRawUnsafe('DELETE FROM "User" CASCADE');
  });

  afterAll(async () => {
    await container.stop({ timeout: 1000 });
    return prismaClient.$disconnect();
  });

  test("post command", async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);

    await CommandTestFactory.run(commandInstance, [
      "post",
      "Alice",
      "Message from test",
    ]);

    const aliceMessages = await messageRepository.getMessagesByUser("Alice");
    expect(aliceMessages[0].data).toEqual({
      id: expect.any(String),
      author: "Alice",
      text: "Message from test",
      publishedAt: now.toISOString(),
    });
  });

  test("view command", async () => {
    const messageRepository = new PrismaMessageRepository(prismaClient);
    const consoleTable = vi.fn();
    vi.spyOn(console, "table").mockImplementation(consoleTable);
    await messageRepository.save(
      new MessageBuilder()
        .withAuthor("Alice")
        .withPublishedAt(now)
        .withText("Message Test View command")
        .build()
    );

    await CommandTestFactory.run(commandInstance, ["view", "Alice"]);

    expect(consoleTable).toHaveBeenCalledWith([
      {
        author: "Alice",
        publicationTime: "less than a minute ago",
        text: "Message Test View command",
      },
    ]);
  });
});

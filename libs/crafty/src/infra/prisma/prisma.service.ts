import { PrismaClient } from '@prisma/client';
import { OnModuleInit, INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      this.$disconnect();
      await app.close();
    });
  }
}

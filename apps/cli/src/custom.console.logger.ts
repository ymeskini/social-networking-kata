import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomConsoleLogger extends ConsoleLogger {
  table(tabularData: any) {
    console.table(tabularData);
  }
}

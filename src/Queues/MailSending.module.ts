import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailSendingQueueEvents } from './MailSending.queueEventListener';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'MailSending',
      connection: {
        host: 'localhost',
        port: 6379,
      },

      // removeOnFail: { count: 0 },
    }),
  ],
  providers: [MailSendingQueueEvents],
})
export class QueuesModule {}

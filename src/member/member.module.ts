import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { QueuesModule } from 'src/Queues/MailSending.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'MailSending',
    }),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}

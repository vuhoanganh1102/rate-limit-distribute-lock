import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MemberService {
  constructor(@InjectQueue('MailSending') private mailSendingQueue: Queue) {}
  async create(createMemberDto: CreateMemberDto) {
    this.mailSendingQueue.add(
      'sample',
      {
        foor: 'bar',
      },
      {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: { count: 0 },
        backoff: {
          type: 'exponential', // Mỗi lần lỗi, chờ lâu hơn trước khi thử lại
          delay: 2000, // Lần đầu retry sau 2 giây
        },
      },
    );
    return 'This action adds a new member';
  }

  findAll() {
    return `This action returns all member`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}

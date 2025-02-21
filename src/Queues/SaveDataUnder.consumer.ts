import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

// tao dataconnection pooling de tai su dung ket noi
// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'test',
//   connectionLimit: 10, // Giới hạn tối đa 10 connection mở cùng lúc
// });
const batch: any[] = []; // Mảng lưu trữ dữ liệu từ nhiều job
const BATCH_SIZE = 10; // Số job cần gom trước khi update vào MySQL

@Processor('audio', { concurrency: 10 }) // limited 10 jobs is run in time
export class AudioConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job.id}`);

    // Thêm dữ liệu từ job vào batch
    batch.push({ id: job.id, value: job.data });

    // Nếu đủ 10 job, update vào MySQL
    if (batch.length >= BATCH_SIZE) {
      // await this.batchUpdate();
    }

    return {};
  }

  // func update data
  async batchUpdate() {
    if (batch.length === 0) return; // Không có job nào cần update

    console.log(`Batch updating ${batch.length} jobs into MySQL...`);

    // Tạo câu lệnh UPDATE nhiều dòng bằng CASE WHEN
    const updates = batch
      .map((job) => `WHEN id = ${job.id} THEN '${job.value}'`)
      .join(' ');

    const ids = batch.map((job) => job.id).join(',');

    const sql = `
      UPDATE users
      SET value = CASE ${updates} END
      WHERE id IN (${ids})
    `;

    // const conn = await pool.getConnection();

    // try {
    //   await conn.execute(sql);
    //   console.log(`Batch updated ${batch.length} jobs`);
    // } catch (error) {
    //   console.error(`Batch update failed:`, error);
    // } finally {
    //   conn.release();
    // }

    // Xóa batch sau khi cập nhật xong
    batch.length = 0;
  }
  @OnWorkerEvent('completed')
  async jobCompleted(job: Job): Promise<any> {
    console.log(`Job is completed with id ${job.id}`);
  }

  @OnWorkerEvent('failed')
  async jobFailed(): Promise<any> {
    console.log(`Jobs is failed`);
  }
}

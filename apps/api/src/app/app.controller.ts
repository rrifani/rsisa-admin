import { Controller, Get, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';
import { AppService } from './app.service';
import { DATABASE_POOL } from './database/database.provider';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(DATABASE_POOL) private readonly pool: ConnectionPool
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('db-check')
  async checkDb() {
    const result = await this.pool.request().query('SELECT GETDATE() as time');
    return { connected: true, result: result.recordset };
  }
}

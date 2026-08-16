import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as sql from 'mssql';

export const DATABASE_POOL = 'DATABASE_POOL';
const logger = new Logger('DatabaseProvider');

export const databaseProvider = {
  provide: DATABASE_POOL,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const host = configService.get<string>('DB_HOST');
    const dbName = configService.get<string>('DB_NAME');
    const port = Number(configService.get<string>('DB_PORT')) || 1433;

    const config: sql.config = {
      server: host,
      port,
      user: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: dbName,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };

    try {
      const pool = await sql.connect(config);
      logger.log(`✅ Connected to database "${dbName}" at ${host}:${port}`);
      return pool;
    } catch (error) {
      logger.error(
        `❌ Failed to connect to database at ${host}:${port}`,
        error.message
      );
      throw error;
    }
  },
};

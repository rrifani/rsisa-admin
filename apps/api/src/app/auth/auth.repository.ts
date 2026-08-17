import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';
import { DATABASE_POOL } from '../../constants';
import { UserAccountRow, UserGroup } from './auth.dto';
import { UserTypeEnum } from '@rsisa-admin/shared';

@Injectable()
export class UserRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: ConnectionPool) {}

  async getByUsername(username: string): Promise<UserAccountRow | null> {
    const result = await this.pool.request().input('username', username).query(`
        SELECT 
          b.Id as id,
          ua.UserName as username,
          b.Nama as fullName,
          ua.PasswordHash as passwordHash,
          ua.Salt as salt,
          ua.IsDeleted as deleted,
          ua.IsBuiltIn as isBuiltIn,
          ua.Jenis as jenis
        FROM dbo.UserAccount ua
        LEFT JOIN dbo.Biodata b ON b.Id = ua.PersonId
        WHERE ua.UserName = @username
      `);

    const user = result.recordset[0];
    if (!user) return null;

    const groups = await this.getUserGroups(user.username);

    const type = user.isBuiltIn
      ? UserTypeEnum.ADMINISTRATOR
      : user.jenis != null && user.jenis > 0
      ? UserTypeEnum.DOKTER
      : UserTypeEnum.KARYAWAN;

    return { ...user, groups, type };
  }

  async getUserGroups(username: string): Promise<UserGroup[]> {
    const result = await this.pool.request().input('username', username).query(`
        SELECT g.Id as id, g.Nama as name
        FROM dbo.UserGroupUserAccount uga
        JOIN dbo.UserGroup g ON g.Id = uga.UserGroup_Id
        WHERE uga.UserAccount_UserName = @username
      `);

    return result.recordset;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtHelper } from '@rsisa-admin/shared';
import { SUPER_ADMIN_GROUP_ID } from '../../constants';
import {
  CredentialDto,
  LoginResultDto,
  UserIdentityDto,
  UserAccountRow,
} from './auth.dto';
import { UserRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {}

  async login({
    username,
    password,
    admin,
  }: CredentialDto): Promise<LoginResultDto> {
    const user = await this.findUser(username);

    // Jika login sbg admin, pastikan user punya akses ke grup Super Admin
    if (admin) {
      const superAdminGroupId =
        this.configService.get<string>(SUPER_ADMIN_GROUP_ID);
      if (!user.groups.some((g) => g.id === superAdminGroupId)) {
        throw new UnauthorizedException(
          'Anda tidak diizinkan untuk akses halaman ini.'
        );
      }
    }

    const isValid = await this.verifyPassword(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Kata sandi yang anda masukkan salah.');
    }

    return this.createToken(user);
  }

  async findUser(username: string): Promise<UserAccountRow> {
    const user = await this.userRepository.getByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Nama pengguna tidak ditemukan.');
    }

    // User yang sudah dihapus/dinonaktifkan tidak bisa login
    if (user.deleted) {
      throw new UnauthorizedException(
        'Akun anda telah dinonaktifkan. Silakan hubungi administrator.'
      );
    }

    return user;
  }

  private async verifyPassword(
    user: UserAccountRow,
    password: string
  ): Promise<boolean> {
    return JwtHelper.verifyPassword(user.passwordHash, user.salt, password);
  }

  private createToken(user: UserAccountRow): LoginResultDto {
    const identity: UserIdentityDto = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      type: user.type,
      jenis: user.jenis,
    };

    const token = JwtHelper.createToken(identity);

    return { token };
  }
}

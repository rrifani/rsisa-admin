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
export class AuthService {}

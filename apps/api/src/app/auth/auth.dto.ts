import { JenisPetugasEnum, UserTypeEnum } from '@rsisa-admin/shared';

export interface CredentialDto {
  username: string;
  password: string;
  admin?: boolean;
}

export interface LoginResultDto {
  token: string;
}

export interface UserIdentityDto {
  id: string;
  username: string;
  fullName: string;
  type: UserTypeEnum;
  jenis?: JenisPetugasEnum;
}

export interface UserGroup {
  id: string;
  name: string;
}

export interface UserAccountRow {
  id: string;
  username: string;
  fullName: string;
  passwordHash: string;
  salt: string;
  type: UserTypeEnum;
  jenis?: JenisPetugasEnum;
  deleted?: boolean;
  groups: UserGroup[];
}

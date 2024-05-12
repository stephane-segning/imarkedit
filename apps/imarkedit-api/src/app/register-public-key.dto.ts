import { IsDefined, IsString } from 'class-validator';

export class RegisterPublicKeyDto {
  @IsDefined()
  @IsString()
  publicKey: string;

  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsString()
  otp: string;

  @IsDefined()
  @IsString()
  kid: string;
}

export class RegisterPublicKeyResponse {
  @IsDefined()
  @IsString()
  kid: string;

  @IsDefined()
  @IsString()
  accountId: string;
}

export class RegisterAccount {
  @IsDefined()
  @IsString()
  username: string;
}

export class ConfirmRegisterAccount {
  @IsDefined()
  @IsString()
  token: string;

  @IsDefined()
  @IsString()
  username: string;
}

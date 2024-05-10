import { IsDefined, IsString } from 'class-validator';

export class RegisterPublicKeyDto {
  @IsDefined()
  @IsString()
  kid: string;

  @IsDefined()
  @IsString()
  publicKey: string;

  @IsString()
  accountId?: string;
}


export class RegisterPublicKeyResponse {
  @IsDefined()
  @IsString()
  kid: string;

  @IsDefined()
  @IsString()
  accountId: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class SignOutBodyDto {
  @ApiProperty({
    description: 'Session JWT access token.',
    type: 'string',
  })
  jwt: string;
}

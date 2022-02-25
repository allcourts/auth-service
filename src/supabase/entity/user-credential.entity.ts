import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserCredential {
  @ApiProperty({
    description: 'User authentication email.',
    example: 'john.doe@email.com',
    type: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User authentication password.',
    example: 'SecurePassword9$',
    type: 'string',
  })
  @IsString()
  @Length(6, 50)
  password: string;
}

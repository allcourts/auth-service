import { ApiProperty } from '@nestjs/swagger';

export class AuthUser {
  @ApiProperty({
    description: 'User unique identifier.',
    example: '71b3c064-a7df-4a6c-9588-dc347a284558',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'User email.',
    example: 'john.doe@email.com',
    type: 'string',
  })
  email: string;

  role: string;

  @ApiProperty({
    description: 'User last sign in date',
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
    format: 'ISO',
  })
  lastSignInAt: Date;

  @ApiProperty({
    description: 'User creation date',
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
    format: 'ISO',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
    format: 'ISO',
  })
  updatedAt: Date;
}

export class AuthSession {
  @ApiProperty({
    description: 'Session JWT access token.',
    type: 'string',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Timestamp of when the access token will expire.',
    example: 1645564788,
    type: 'number',
  })
  expiresAt: number;

  @ApiProperty({
    description: 'Number of seconds until the access token expires.',
    example: 86400,
    type: 'number',
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Refresh token for the access token.',
    type: 'string',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Authenticated user info.',
    type: AuthUser,
  })
  user: AuthUser;
}

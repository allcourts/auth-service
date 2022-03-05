import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '71b3c064-a7df-4a6c-9588-dc347a284558',
    type: 'string',
  })
  @IsUUID()
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User auth account identifier',
    example: '71b3c064-a7df-4a6c-9588-dc347a284558',
    type: 'string',
  })
  @IsUUID()
  @IsNotEmpty()
  @Column({ name: 'auth_id' })
  authId: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    type: 'string',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
    format: 'ISO',
  })
  @IsDate()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
    format: 'ISO',
  })
  @IsDate()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

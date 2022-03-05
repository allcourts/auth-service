import { PickType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class CreateUserBodyDto extends PickType(User, [
  'authId',
  'name',
] as const) {}

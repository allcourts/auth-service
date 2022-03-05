import { PickType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class GetUserParamsDto extends PickType(User, ['id'] as const) {}

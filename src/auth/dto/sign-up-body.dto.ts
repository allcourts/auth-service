import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserCredentialsDto } from 'src/supabase/dto/user-credentials.dto';
import { User } from 'src/user/entity/user.entity';

export class SignUpBodyDto extends IntersectionType(
  UserCredentialsDto,
  PickType(User, ['name'] as const),
) {}

import { AuthUser } from 'src/auth/dto/auth-session.dto';
import { User } from 'src/user/entity/user.entity';

export type UserSignUpMessageDto = Pick<AuthUser, 'email'> &
  Pick<User, 'id' | 'name'>;

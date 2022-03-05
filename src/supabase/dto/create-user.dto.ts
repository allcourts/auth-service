import { UserAttributes } from '@supabase/supabase-js';
import { UserMetadata } from './user-metadata.dto';

export interface CreateUserDto
  extends Pick<UserAttributes, 'email' | 'password'> {
  userMetadata?: UserMetadata;
}

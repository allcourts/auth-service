import { UserAttributes } from '@supabase/supabase-js';
import { UserMetadata } from './user-metadata.dto';

export interface UpdateUserDto extends Partial<Pick<UserAttributes, 'email'>> {
  userMetadata?: UserMetadata;
}

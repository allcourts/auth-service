import { UserAttributes } from '@supabase/supabase-js';

export type EmailSignInDto = Pick<UserAttributes, 'email' | 'password'>;

import { ApiError, Session, User } from '@supabase/supabase-js';
import { Chance } from 'chance';

const chance = new Chance();

interface SupabaseMock {
  user: (user?: Partial<User>) => User;
  session: (session?: Partial<Session>) => Session;
  error: (error?: Partial<ApiError>) => ApiError;
}

const user = (user?: Partial<User>): User => ({
  id: chance.string(),
  app_metadata: {},
  user_metadata: {},
  aud: chance.string(),
  confirmation_sent_at: chance.date().toISOString(),
  recovery_sent_at: chance.date().toISOString(),
  invited_at: chance.date().toISOString(),
  action_link: chance.string(),
  email: chance.email(),
  phone: chance.phone(),
  created_at: chance.date().toISOString(),
  confirmed_at: chance.date().toISOString(),
  email_confirmed_at: chance.date().toISOString(),
  phone_confirmed_at: chance.date().toISOString(),
  last_sign_in_at: chance.date().toISOString(),
  role: chance.string(),
  updated_at: chance.date().toISOString(),
  identities: [],
  ...user,
});

const session = (session?: Partial<Session>): Session => ({
  access_token: chance.string(),
  expires_in: chance.integer(),
  expires_at: chance.integer(),
  refresh_token: chance.string(),
  token_type: chance.string(),
  user: user(),
  ...session,
});

const error = (error?: Partial<ApiError>): ApiError => ({
  message: chance.string(),
  status: 500,
  ...error,
});

export const supabaseMock: SupabaseMock = {
  user,
  session,
  error,
};

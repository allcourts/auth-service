import { ApiError, Session, User } from '@supabase/supabase-js';
import { Chance } from 'chance';

const chance = new Chance();

export const supabaseUserMock = (user?: Partial<User>): User => ({
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

export const supabaseSessionMock = (session?: Partial<Session>): Session => ({
  access_token: chance.string(),
  expires_in: chance.integer(),
  expires_at: chance.integer(),
  refresh_token: chance.string(),
  token_type: chance.string(),
  user: supabaseUserMock(),
  ...session,
});

export const supabaseApiErrorMock = (error?: Partial<ApiError>): ApiError => ({
  message: chance.string(),
  status: 500,
  ...error,
});

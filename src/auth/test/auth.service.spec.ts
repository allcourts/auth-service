import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Session } from '@supabase/supabase-js';
import { Chance } from 'chance';
import { configServiceMock } from 'src/config/test/config.mock';
import { SupabaseService } from 'src/supabase/supabase.service';
import { supabaseSessionMock } from 'src/supabase/test/supabase.mock';
import { AuthService } from '../auth.service';
import { AuthSession } from '../dto/auth-session.dto';
import { SignUpBodyDto } from '../dto/sign-up-body.dto';

const chance = new Chance();

describe('AuthService', () => {
  let authService: AuthService;
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        SupabaseService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    supabaseService = app.get<SupabaseService>(SupabaseService);
  });

  function getAuthSession(session: Session): AuthSession {
    return {
      accessToken: session.access_token,
      expiresIn: session.expires_in,
      expiresAt: session.expires_at,
      refreshToken: session.refresh_token,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        lastSignInAt: new Date(session.user.last_sign_in_at),
        createdAt: new Date(session.user.created_at),
        updatedAt: new Date(session.user.updated_at),
      },
    };
  }

  describe('signUp', () => {
    it('should signUp successfully', async () => {
      const bodyMock: SignUpBodyDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const sessionMock = supabaseSessionMock();
      sessionMock.user.email = bodyMock.email;

      const authSessionMock = getAuthSession(sessionMock);

      supabaseService.signUp = jest.fn().mockResolvedValue(sessionMock);

      const session = await authService.signUp(bodyMock);

      expect(supabaseService.signUp).toBeCalledTimes(1);
      expect(supabaseService.signUp).toBeCalledWith(bodyMock);
      expect(session).toStrictEqual(authSessionMock);
    });

    it('should throw InternalServerErrorException', async () => {
      const bodyMock: SignUpBodyDto = {
        email: chance.email(),
        password: chance.string(),
      };

      supabaseService.signUp = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await authService.signUp(bodyMock);
        fail('should have thrown InternalServerErrorException');
      } catch (err) {
        expect(supabaseService.signUp).toBeCalledTimes(1);
        expect(supabaseService.signUp).toBeCalledWith(bodyMock);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('signIn', () => {
    it('should signIn successfully', async () => {
      const bodyMock: SignUpBodyDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const sessionMock = supabaseSessionMock();
      sessionMock.user.email = bodyMock.email;

      const authSessionMock = getAuthSession(sessionMock);

      supabaseService.signIn = jest.fn().mockResolvedValue(sessionMock);

      const session = await authService.signIn(bodyMock);

      expect(supabaseService.signIn).toBeCalledTimes(1);
      expect(supabaseService.signIn).toBeCalledWith(bodyMock);
      expect(session).toStrictEqual(authSessionMock);
    });

    it('should throw InternalServerErrorException', async () => {
      const bodyMock: SignUpBodyDto = {
        email: chance.email(),
        password: chance.string(),
      };

      supabaseService.signIn = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await authService.signIn(bodyMock);
        fail('should have thrown InternalServerErrorException');
      } catch (err) {
        expect(supabaseService.signIn).toBeCalledTimes(1);
        expect(supabaseService.signIn).toBeCalledWith(bodyMock);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('signOut', () => {
    it('should signOut successfully', async () => {
      const jwtMock = {
        jwt: chance.string(),
      };

      supabaseService.signOut = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve());

      await authService.signOut(jwtMock);

      expect(supabaseService.signOut).toBeCalledTimes(1);
      expect(supabaseService.signOut).toBeCalledWith(jwtMock.jwt);
    });

    it('should throw InternalServerErrorException', async () => {
      const jwtMock = {
        jwt: chance.string(),
      };

      supabaseService.signOut = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await authService.signOut(jwtMock);
        fail('should have thrown InternalServerErrorException');
      } catch (err) {
        expect(supabaseService.signOut).toBeCalledTimes(1);
        expect(supabaseService.signOut).toBeCalledWith(jwtMock.jwt);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});

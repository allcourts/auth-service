import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Session } from '@supabase/supabase-js';
import { Chance } from 'chance';
import { configServiceMock } from 'src/config/test/config.mock';
import { SupabaseService } from 'src/supabase/supabase.service';
import { supabaseSessionMock } from 'src/supabase/test/supabase.mock';
import { UserMessagingService } from 'src/user-messaging/user-messaging.service';
import { userMock } from 'src/user/test/user.mock';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { AuthSession } from '../dto/auth-session.dto';
import { SignInBodyDto } from '../dto/sign-in-body.dto';
import { SignUpBodyDto } from '../dto/sign-up-body.dto';

const chance = new Chance();

describe('AuthService', () => {
  let authService: AuthService;
  let supabaseService: SupabaseService;
  let userService: UserService;
  let userMessagingService: UserMessagingService;

  beforeEach(async () => {
    supabaseService = new SupabaseService(null);
    userService = new UserService(null);
    userMessagingService = new UserMessagingService(null);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: supabaseService },
        { provide: UserService, useValue: userService },
        { provide: UserMessagingService, useValue: userMessagingService },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    supabaseService = app.get<SupabaseService>(SupabaseService);
    userService = app.get<UserService>(UserService);
    userMessagingService = app.get<UserMessagingService>(UserMessagingService);
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
        name: chance.string(),
      };

      const sessionMock = supabaseSessionMock();
      sessionMock.user.email = bodyMock.email;

      const authSessionMock = getAuthSession(sessionMock);

      const userEntityMock = userMock({
        name: bodyMock.name,
        authId: sessionMock.user.id,
      });

      supabaseService.createUser = jest
        .fn()
        .mockResolvedValue(sessionMock.user);

      userService.create = jest.fn().mockResolvedValue(userEntityMock);

      supabaseService.updateUserById = jest.fn();

      userMessagingService.publishUserSignUpMessage = jest.fn();

      authService.signIn = jest.fn().mockResolvedValue(authSessionMock);

      const session = await authService.signUp(bodyMock);

      expect(supabaseService.createUser).toBeCalledTimes(1);
      expect(supabaseService.createUser).toBeCalledWith({
        email: bodyMock.email,
        password: bodyMock.password,
      });

      expect(userService.create).toBeCalledTimes(1);
      expect(userService.create).toBeCalledWith({
        authId: sessionMock.user.id,
        name: bodyMock.name,
      });

      expect(supabaseService.updateUserById).toBeCalledTimes(1);
      expect(supabaseService.updateUserById).toBeCalledWith(
        sessionMock.user.id,
        {
          userMetadata: { id: userEntityMock.id },
        },
      );

      expect(userMessagingService.publishUserSignUpMessage).toBeCalledTimes(1);
      expect(userMessagingService.publishUserSignUpMessage).toBeCalledWith({
        id: userEntityMock.id,
        email: sessionMock.user.email,
        name: userEntityMock.name,
      });

      expect(authService.signIn).toBeCalledTimes(1);
      expect(authService.signIn).toBeCalledWith({
        email: bodyMock.email,
        password: bodyMock.password,
      });

      expect(session).toStrictEqual(authSessionMock);
    });

    it('should throw InternalServerErrorException', async () => {
      const bodyMock: SignUpBodyDto = {
        email: chance.email(),
        password: chance.string(),
        name: chance.string(),
      };

      supabaseService.createUser = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await authService.signUp(bodyMock);
        fail('should have thrown InternalServerErrorException');
      } catch (err) {
        expect(supabaseService.createUser).toBeCalledTimes(1);
        expect(supabaseService.createUser).toBeCalledWith({
          email: bodyMock.email,
          password: bodyMock.password,
        });
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('signIn', () => {
    it('should signIn successfully', async () => {
      const bodyMock: SignInBodyDto = {
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
      const bodyMock: SignInBodyDto = {
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

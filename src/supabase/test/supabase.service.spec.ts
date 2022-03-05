import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { configServiceMock } from 'src/config/test/config.mock';
import { SupabaseService } from 'src/supabase/supabase.service';
import {
  supabaseSessionMock,
  supabaseApiErrorMock,
  supabaseUserMock,
} from 'src/supabase/test/supabase.mock';
import { CreateUserDto } from '../dto/create-user.dto';
import { EmailSignInDto } from '../dto/email-sign-in.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const chance = new Chance();

describe('SupabaseService', () => {
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    supabaseService = app.get<SupabaseService>(SupabaseService);
    supabaseService['client'] = {
      auth: {
        api: {},
      },
      from: () => ({ select: () => ({}) }),
    } as any;
  });

  describe('createUser', () => {
    beforeEach(() => {
      supabaseService['isEmailConfirmationEnabled'] = false;
    });

    it('should create a user', async () => {
      const bodyMock: CreateUserDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const userMock = supabaseUserMock({ email: bodyMock.email });

      const supabaseClientResponseMock = {
        data: userMock,
      };

      supabaseService['client'].auth.api.createUser = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      const user = await supabaseService.createUser(bodyMock);

      expect(supabaseService['client'].auth.api.createUser).toBeCalledTimes(1);
      expect(supabaseService['client'].auth.api.createUser).toBeCalledWith({
        email: bodyMock.email,
        password: bodyMock.password,
        user_metadata: bodyMock.userMetadata,
        email_confirm: false,
      });
      expect(user).toStrictEqual(supabaseClientResponseMock.data);
    });

    it('should throw HttpException with status 400', async () => {
      const bodyMock: CreateUserDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const apiErrorMock = supabaseApiErrorMock({ status: 400 });
      const supabaseClientResponseMock = {
        error: apiErrorMock,
      };

      supabaseService['client'].auth.api.createUser = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      try {
        await supabaseService.createUser(bodyMock);
        fail('should have thrown HttpException with status 400');
      } catch (err) {
        expect(supabaseService['client'].auth.api.createUser).toBeCalledTimes(
          1,
        );
        expect(supabaseService['client'].auth.api.createUser).toBeCalledWith({
          email: bodyMock.email,
          password: bodyMock.password,
          user_metadata: bodyMock.userMetadata,
          email_confirm: false,
        });
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(apiErrorMock.status);
        expect(err.message).toBe(apiErrorMock.message);
      }
    });
  });

  describe('updateUserById', () => {
    it('should update a user', async () => {
      const userIdMock = chance.string();
      const bodyMock: UpdateUserDto = {
        userMetadata: { id: chance.string() },
      };

      const userMock = supabaseUserMock({ id: userIdMock });

      const supabaseClientResponseMock = {
        data: userMock,
      };

      supabaseService['client'].auth.api.updateUserById = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      const user = await supabaseService.updateUserById(userIdMock, bodyMock);

      expect(supabaseService['client'].auth.api.updateUserById).toBeCalledTimes(
        1,
      );
      expect(supabaseService['client'].auth.api.updateUserById).toBeCalledWith(
        userIdMock,
        {
          email: bodyMock.email,
          user_metadata: bodyMock.userMetadata,
        },
      );
      expect(user).toStrictEqual(supabaseClientResponseMock.data);
    });

    it('should throw HttpException with status 400', async () => {
      const userIdMock = chance.string();
      const bodyMock: CreateUserDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const apiErrorMock = supabaseApiErrorMock({ status: 400 });
      const supabaseClientResponseMock = {
        error: apiErrorMock,
      };

      supabaseService['client'].auth.api.updateUserById = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      try {
        await supabaseService.updateUserById(userIdMock, bodyMock);
        fail('should have thrown HttpException with status 400');
      } catch (err) {
        expect(
          supabaseService['client'].auth.api.updateUserById,
        ).toBeCalledTimes(1);
        expect(
          supabaseService['client'].auth.api.updateUserById,
        ).toBeCalledWith(userIdMock, {
          email: bodyMock.email,
          user_metadata: bodyMock.userMetadata,
        });
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(apiErrorMock.status);
        expect(err.message).toBe(apiErrorMock.message);
      }
    });
  });

  describe('signIn', () => {
    it('should signIn successfully', async () => {
      const bodyMock: EmailSignInDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const sessionMock = supabaseSessionMock();
      sessionMock.user.email = bodyMock.email;

      const supabaseClientResponseMock = {
        data: sessionMock,
      };

      supabaseService['client'].auth.api.signInWithEmail = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      const session = await supabaseService.signIn(bodyMock);

      expect(
        supabaseService['client'].auth.api.signInWithEmail,
      ).toBeCalledTimes(1);
      expect(supabaseService['client'].auth.api.signInWithEmail).toBeCalledWith(
        bodyMock.email,
        bodyMock.password,
      );
      expect(session).toStrictEqual(supabaseClientResponseMock.data);
    });

    it('should throw HttpException with status 400', async () => {
      const bodyMock: EmailSignInDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const apiErrorMock = supabaseApiErrorMock({ status: 400 });
      const supabaseClientResponseMock = {
        error: apiErrorMock,
      };

      supabaseService['client'].auth.api.signInWithEmail = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      try {
        await supabaseService.signIn(bodyMock);
        fail('should have thrown HttpException with status 400');
      } catch (err) {
        expect(
          supabaseService['client'].auth.api.signInWithEmail,
        ).toBeCalledTimes(1);
        expect(
          supabaseService['client'].auth.api.signInWithEmail,
        ).toBeCalledWith(bodyMock.email, bodyMock.password);
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(apiErrorMock.status);
        expect(err.message).toBe(apiErrorMock.message);
      }
    });
  });

  describe('signOut', () => {
    it('should signOut successfully', async () => {
      const jwtMock = chance.string();

      supabaseService['client'].auth.api.signOut = jest
        .fn()
        .mockResolvedValue({});

      await supabaseService.signOut(jwtMock);

      expect(supabaseService['client'].auth.api.signOut).toBeCalledTimes(1);
      expect(supabaseService['client'].auth.api.signOut).toBeCalledWith(
        jwtMock,
      );
    });

    it('should throw HttpException with status 400', async () => {
      const jwtMock = chance.string();

      const apiErrorMock = supabaseApiErrorMock({ status: 400 });
      const supabaseClientResponseMock = {
        error: apiErrorMock,
      };

      supabaseService['client'].auth.api.signOut = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      try {
        await supabaseService.signOut(jwtMock);
        fail('should have thrown HttpException with status 400');
      } catch (err) {
        expect(supabaseService['client'].auth.api.signOut).toBeCalledTimes(1);
        expect(supabaseService['client'].auth.api.signOut).toBeCalledWith(
          jwtMock,
        );
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(apiErrorMock.status);
        expect(err.message).toBe(apiErrorMock.message);
      }
    });
  });

  describe('status', () => {
    it('should run successfully', async () => {
      const statusMock = {};
      const selectFunctionMock = jest.fn().mockResolvedValue(statusMock);

      supabaseService['client'].from = jest.fn().mockReturnValue({
        select: selectFunctionMock,
      });

      await supabaseService.status();

      expect(selectFunctionMock).toBeCalledTimes(1);
    });

    it('should throw InternalServerErrorException', async () => {
      const apiErrorMock = supabaseApiErrorMock({ status: 400 });
      const supabaseClientResponseMock = {
        error: apiErrorMock,
      };
      const selectFunctionMock = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      supabaseService['client'].from = jest.fn().mockReturnValue({
        select: selectFunctionMock,
      });

      try {
        await supabaseService.status();
        fail('should have thrown InternalServerErrorException');
      } catch (err) {
        expect(selectFunctionMock).toBeCalledTimes(1);
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe(apiErrorMock.message);
      }
    });
  });
});

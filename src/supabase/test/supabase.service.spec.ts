import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { configServiceMock } from 'src/config/test/config.mock';
import { SupabaseService } from 'src/supabase/supabase.service';
import {
  supabaseSessionMock,
  supabaseApiErrorMock,
} from 'src/supabase/test/supabase.mock';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';

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

  describe('signUp', () => {
    it('should signUp successfully', async () => {
      const bodyMock: SignUpDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const sessionMock = supabaseSessionMock();
      sessionMock.user.email = bodyMock.email;

      const supabaseClientResponseMock = {
        data: sessionMock,
      };

      supabaseService['client'].auth.api.signUpWithEmail = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      const session = await supabaseService.signUp(bodyMock);

      expect(
        supabaseService['client'].auth.api.signUpWithEmail,
      ).toBeCalledTimes(1);
      expect(supabaseService['client'].auth.api.signUpWithEmail).toBeCalledWith(
        bodyMock.email,
        bodyMock.password,
      );
      expect(session).toStrictEqual(supabaseClientResponseMock.data);
    });

    it('should throw HttpException with status 400', async () => {
      const bodyMock: SignUpDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const apiErrorMock = supabaseApiErrorMock({ status: 400 });
      const supabaseClientResponseMock = {
        error: apiErrorMock,
      };

      supabaseService['client'].auth.api.signUpWithEmail = jest
        .fn()
        .mockResolvedValue(supabaseClientResponseMock);

      try {
        await supabaseService.signUp(bodyMock);
        fail('should have thrown HttpException with status 400');
      } catch (err) {
        expect(
          supabaseService['client'].auth.api.signUpWithEmail,
        ).toBeCalledTimes(1);
        expect(
          supabaseService['client'].auth.api.signUpWithEmail,
        ).toBeCalledWith(bodyMock.email, bodyMock.password);
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(apiErrorMock.status);
        expect(err.message).toBe(apiErrorMock.message);
      }
    });
  });

  describe('signIn', () => {
    it('should signIn successfully', async () => {
      const bodyMock: SignInDto = {
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
      const bodyMock: SignInDto = {
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

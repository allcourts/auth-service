import { Chance } from 'chance';
import { CreateUserBodyDto } from '../dto/create-user-body.dto';
import { GetUserParamsDto } from '../dto/get-user-params.dto';
import { User } from '../entity/user.entity';

const chance = new Chance();

export const userMock = (user?: Partial<User>): User => ({
  id: chance.string(),
  authId: chance.string(),
  name: chance.string(),
  createdAt: chance.date(),
  updatedAt: chance.date(),
  ...user,
});

export const createUserBodyMock = (
  createUserBodyMock?: Partial<CreateUserBodyDto>,
): CreateUserBodyDto => ({
  authId: chance.string(),
  name: chance.string(),
  ...createUserBodyMock,
});

export const getUserParamsMock = (
  getUserParamsMock?: Partial<GetUserParamsDto>,
): GetUserParamsDto => ({
  id: chance.string(),
  ...getUserParamsMock,
});

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../user.service';
import { userMock, createUserBodyMock, getUserParamsMock } from './user.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const bodyMock = createUserBodyMock();

      const createdUserMock = userMock({
        authId: bodyMock.authId,
        name: bodyMock.name,
      });

      userRepository.createUser = jest.fn().mockResolvedValue(createdUserMock);

      const createdUser = await userService.create(bodyMock);

      expect(userRepository.createUser).toBeCalledTimes(1);
      expect(userRepository.createUser).toBeCalledWith(bodyMock);
      expect(createdUser).toStrictEqual(createdUserMock);
    });

    it('should throw ConflictException because of an unique column conflict', async () => {
      const bodyMock = createUserBodyMock();

      userRepository.createUser = jest
        .fn()
        .mockRejectedValue(new ConflictException());

      try {
        await userRepository.createUser(bodyMock);
        fail('should have thrown ConflictException');
      } catch (err) {
        expect(userRepository.createUser).toBeCalledTimes(1);
        expect(userRepository.createUser).toBeCalledWith(bodyMock);
        expect(err).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('find', () => {
    it('should find a user by id', async () => {
      const paramsMock = getUserParamsMock();

      const retrievedUserMock = userMock({
        id: paramsMock.id,
      });

      userRepository.findOne = jest.fn().mockResolvedValue(retrievedUserMock);

      const user = await userService.find(paramsMock);

      expect(userRepository.findOne).toBeCalledTimes(1);
      expect(userRepository.findOne).toBeCalledWith(paramsMock);
      expect(user).toStrictEqual(retrievedUserMock);
    });

    it('should throw NotFoundException because no user was retrieved', async () => {
      const paramsMock = getUserParamsMock();

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      try {
        await userService.find(paramsMock);
        fail('should have thrown NotFoundException');
      } catch (err) {
        expect(userRepository.findOne).toBeCalledTimes(1);
        expect(userRepository.findOne).toBeCalledWith(paramsMock);
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

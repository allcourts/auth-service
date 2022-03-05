import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserBodyDto } from './dto/create-user-body.dto';
import { GetUserParamsDto } from './dto/get-user-params.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserBodyDto: CreateUserBodyDto): Promise<User> {
    const newUser = await this.userRepository.createUser(createUserBodyDto);

    return newUser;
  }

  async find(getUserParamsDto: GetUserParamsDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne(getUserParamsDto);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}

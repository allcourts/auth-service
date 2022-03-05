import { ConflictException, Logger } from '@nestjs/common';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  async createUser(user: DeepPartial<User>) {
    try {
      const newUser = await this.save(user);

      return newUser;
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException(err.detail);
      }

      throw err;
    }
  }
}

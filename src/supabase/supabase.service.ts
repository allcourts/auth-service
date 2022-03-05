import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from 'src/config/base.config';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailSignInDto } from './dto/email-sign-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;
  private isEmailConfirmationEnabled: boolean;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const { url, key, emailConfirmation } =
      this.configService.get<SupabaseConfig>('base.supabase');

    this.client = createClient(url, key);
    this.isEmailConfirmationEnabled = emailConfirmation;
    this.logger.log('Supabase client initialized');
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, userMetadata } = createUserDto;

    const { data, error } = await this.client.auth.api.createUser({
      email,
      password,
      user_metadata: userMetadata,
      email_confirm: this.isEmailConfirmationEnabled,
    });

    if (error) {
      this.logger.log(`Error on create user: ${JSON.stringify(error)}`);

      throw new HttpException(error.message, error.status);
    }

    return data;
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    const { email, userMetadata } = updateUserDto;
    const { data, error } = await this.client.auth.api.updateUserById(id, {
      email,
      user_metadata: userMetadata,
      email_confirm: email ? this.isEmailConfirmationEnabled : undefined,
    });

    if (error) {
      this.logger.log(`Error on update user: ${JSON.stringify(error)}`);

      throw new HttpException(error.message, error.status);
    }

    return data;
  }

  async signIn(emailSignInDto: EmailSignInDto) {
    const { email, password } = emailSignInDto;
    const { data, error } = await this.client.auth.api.signInWithEmail(
      email,
      password,
    );

    if (error) {
      this.logger.log(`Error on user sign in: ${JSON.stringify(error)}`);

      throw new HttpException(error.message, error.status);
    }

    return data;
  }

  async signOut(jwt: string) {
    const { error } = await this.client.auth.api.signOut(jwt);

    if (error) {
      this.logger.log(`Error on user sign out: ${JSON.stringify(error)}`);

      throw new HttpException(error.message, error.status);
    }
  }

  async status() {
    const { error } = await this.client.from('status').select();

    if (error) {
      this.logger.log(`Error on retrieving status: ${JSON.stringify(error)}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}

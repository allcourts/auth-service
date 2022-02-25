import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from 'src/config/base.config';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const { url, key } =
      this.configService.get<SupabaseConfig>('base.supabase');

    this.client = createClient(url, key);
    this.logger.log('Supabase client initialized');
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    const { data, error } = await this.client.auth.api.signUpWithEmail(
      email,
      password,
    );

    if (error) {
      this.logger.log(`Error on user sign up: ${JSON.stringify(error)}`);

      throw new HttpException(error.message, error.status);
    }

    return data as Session;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
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

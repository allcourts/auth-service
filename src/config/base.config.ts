import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import { registerAs } from '@nestjs/config';
import { Environment } from './enum/environment.enum';

export class EnvironmentVariables {
  @IsNumber()
  @IsPositive()
  PORT: number;

  @IsString()
  @IsEnum(Environment)
  ENV: Environment;

  @IsUrl()
  SUPABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_KEY: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_JWT_SECRET: string;

  @IsBoolean()
  SUPABASE_EMAIL_CONFIRMATION: boolean;

  @IsString()
  @IsNotEmpty()
  USER_RABBITMQ_URI: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  @IsPositive()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;
}

export interface SupabaseConfig {
  url: string;
  key: string;
  jwtSecret: string;
  emailConfirmation: boolean;
}

export interface RabbitMQConfig {
  userUri: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}

export interface EnvConfig {
  port: number;
  env: Environment;
  supabase: SupabaseConfig;
  rabbitmq: RabbitMQConfig;
  database: DatabaseConfig;
}

export default registerAs('base', () => {
  const validatedConfig = plainToClass(EnvironmentVariables, process.env, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  const envConfig: EnvConfig = {
    port: validatedConfig.PORT,
    env: validatedConfig.ENV,
    supabase: {
      url: validatedConfig.SUPABASE_URL,
      key: validatedConfig.SUPABASE_KEY,
      jwtSecret: validatedConfig.SUPABASE_JWT_SECRET,
      emailConfirmation: validatedConfig.SUPABASE_EMAIL_CONFIRMATION,
    },
    rabbitmq: {
      userUri: validatedConfig.USER_RABBITMQ_URI,
    },
    database: {
      host: validatedConfig.DB_HOST,
      port: validatedConfig.DB_PORT,
      name: validatedConfig.DB_NAME,
      username: validatedConfig.DB_USERNAME,
      password: validatedConfig.DB_PASSWORD,
    },
  };

  return envConfig;
});

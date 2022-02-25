import { plainToClass } from 'class-transformer';
import {
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
}

export interface SupabaseConfig {
  url: string;
  key: string;
  jwtSecret: string;
}

export interface EnvConfig {
  port: number;
  env: Environment;
  supabase: SupabaseConfig;
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
    },
  };

  return envConfig;
});

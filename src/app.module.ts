import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUsersTable1644907643307 } from 'migrations/1644907643307-CreateUsersTable';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import baseConfig, { DatabaseConfig } from './config/base.config';
import { SupabaseModule } from './supabase/supabase.module';
import { UserMessagingModule } from './user-messaging/user-messaging.module';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig =
          configService.get<DatabaseConfig>('base.database');

        return {
          type: 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          database: databaseConfig.name,
          username: databaseConfig.username,
          password: databaseConfig.password,
          entities: [User],
          synchronize: false,
          migrationsRun: true,
          retryAttempts: 1,
          migrations: [CreateUsersTable1644907643307],
        };
      },
    }),
    AuthModule,
    SupabaseModule,
    UserModule,
    UserMessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

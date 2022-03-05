import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQConfig } from 'src/config/base.config';
import { UserMessagingService } from './user-messaging.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rabbitmqConfig =
          configService.get<RabbitMQConfig>('base.rabbitmq');

        return {
          exchanges: [
            {
              name: 'auth-service.user.sign-up',
              type: 'fanout',
            },
          ],
          uri: rabbitmqConfig.userUri,
          connectionInitOptions: { wait: false },
        };
      },
    }),
    UserMessagingModule,
  ],
  providers: [UserMessagingService],
  exports: [UserMessagingService],
})
export class UserMessagingModule {}

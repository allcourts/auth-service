import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserSignUpMessageDto } from './dto/user-sign-up-message.dto';

@Injectable()
export class UserMessagingService {
  private readonly logger = new Logger(UserMessagingService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishUserSignUpMessage(userSignUpMessageDto: UserSignUpMessageDto) {
    this.logger.log(
      `Publishing user sign up message: ${JSON.stringify(
        userSignUpMessageDto,
      )}`,
    );

    await this.amqpConnection.publish(
      'auth-service.user.sign-up',
      '',
      userSignUpMessageDto,
    );
  }

  async status() {
    const status = this.amqpConnection.managedConnection.isConnected();

    if (!status) {
      throw new InternalServerErrorException(
        'AMQP connection is not established',
      );
    }
  }
}

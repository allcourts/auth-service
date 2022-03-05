import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { EnvConfig } from './config/base.config';
import { SupabaseService } from './supabase/supabase.service';
import { UserMessagingService } from './user-messaging/user-messaging.service';

@Injectable()
export class AppService {
  constructor(
    private readonly connection: Connection,
    private readonly supabaseService: SupabaseService,
    private readonly userMessagingService: UserMessagingService,
    private readonly configService: ConfigService,
  ) {}

  async status() {
    const envConfig = this.configService.get<EnvConfig>('base');
    const status = {
      service: 'OK',
      databases: [],
      rabbitmq: [],
      integrations: [],
    };

    try {
      await this.supabaseService.status();
      status.integrations.push({ name: 'supabase', status: 'OK' });
    } catch (err) {
      status.integrations.push({ name: 'supabase', status: 'ERROR' });
    }

    try {
      await this.connection.query('SELECT 1');
      status.databases.push({ name: envConfig.database.name, status: 'OK' });
    } catch (err) {
      status.databases.push({
        name: envConfig.database.name,
        status: 'ERROR',
      });
    }

    try {
      await this.userMessagingService.status();
      status.rabbitmq.push({ name: 'user', status: 'OK' });
    } catch (err) {
      status.rabbitmq.push({ name: 'user', status: 'ERROR' });
    }

    return status;
  }
}

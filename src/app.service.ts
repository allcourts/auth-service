import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getStatus() {
    const status = {
      service: 'OK',
      integrations: [],
    };

    try {
      await this.supabaseService.status();
      status.integrations.push({ name: 'supabase', status: 'OK' });
    } catch (err) {
      status.integrations.push({ name: 'supabase', status: 'ERROR' });
    }

    return status;
  }
}

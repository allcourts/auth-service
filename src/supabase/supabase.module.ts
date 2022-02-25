import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import baseConfig from 'src/config/base.config';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule.forFeature(baseConfig)],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}

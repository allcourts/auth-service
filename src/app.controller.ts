import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller({
  version: VERSION_NEUTRAL,
})
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  @HttpCode(HttpStatus.OK)
  async getStatus() {
    return await this.appService.getStatus();
  }
}

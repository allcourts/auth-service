import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserBodyDto } from './dto/create-user-body.dto';
import { GetUserParamsDto } from './dto/get-user-params.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: User })
  async create(
    @Body() body: CreateUserBodyDto,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.userService.create(body);

    res.send(response);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User })
  async get(
    @Param() params: GetUserParamsDto,
    @Res() res: Response,
  ): Promise<void> {
    const { id } = params;

    const user = await this.userService.find({ id });

    res.send(user);
  }
}

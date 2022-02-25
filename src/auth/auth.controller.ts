import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSession } from './dto/auth-session.dto';
import { SignInBodyDto } from './dto/sign-in-body.dto';
import { SignOutBodyDto } from './dto/sign-out-body.dto';
import { SignUpBodyDto } from './dto/sign-up-body.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthSession })
  async signUp(@Body() body: SignUpBodyDto) {
    const session = await this.authService.signUp(body);

    return session;
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthSession })
  async signIn(@Body() body: SignInBodyDto) {
    const session = await this.authService.signIn(body);

    return session;
  }

  @Post('signOut')
  @HttpCode(HttpStatus.OK)
  @ApiNoContentResponse()
  async signOut(@Body() body: SignOutBodyDto) {
    const session = await this.authService.signOut(body);

    return session;
  }
}

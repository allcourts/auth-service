import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UserMessagingService } from 'src/user-messaging/user-messaging.service';
import { UserService } from 'src/user/user.service';
import { AuthSession } from './dto/auth-session.dto';
import { SignInBodyDto } from './dto/sign-in-body.dto';
import { SignOutBodyDto } from './dto/sign-out-body.dto';
import { SignUpBodyDto } from './dto/sign-up-body.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userService: UserService,
    private readonly userMessagingService: UserMessagingService,
  ) {}

  async signUp(signUpBodyDto: SignUpBodyDto): Promise<AuthSession> {
    const { email, password, name } = signUpBodyDto;

    const authUser = await this.supabaseService.createUser({
      email,
      password,
    });

    const user = await this.userService.create({ authId: authUser.id, name });

    await this.supabaseService.updateUserById(authUser.id, {
      userMetadata: { id: user.id },
    });

    await this.userMessagingService.publishUserSignUpMessage({
      id: user.id,
      email: authUser.email,
      name: user.name,
    });

    const session = await this.signIn({ email, password });

    return session;
  }

  async signIn(signInBodyDto: SignInBodyDto): Promise<AuthSession> {
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      expires_at: expiresAt,
      refresh_token: refreshToken,
      user,
    } = await this.supabaseService.signIn(signInBodyDto);

    return {
      accessToken,
      expiresIn,
      expiresAt,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        lastSignInAt: new Date(user.last_sign_in_at),
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      },
    };
  }

  async signOut(signUpBodyDto: SignOutBodyDto) {
    await this.supabaseService.signOut(signUpBodyDto.jwt);
  }
}

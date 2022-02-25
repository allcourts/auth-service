import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthSession } from './dto/auth-session.dto';
import { SignInBodyDto } from './dto/sign-in-body.dto';
import { SignOutBodyDto } from './dto/sign-out-body.dto';
import { SignUpBodyDto } from './dto/sign-up-body.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async signUp(signUpBodyDto: SignUpBodyDto): Promise<AuthSession> {
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      expires_at: expiresAt,
      refresh_token: refreshToken,
      user,
    } = await this.supabaseService.signUp(signUpBodyDto);

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

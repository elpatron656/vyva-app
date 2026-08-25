import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash?: string;
  displayName: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY';
  coins: number;
  isVip: boolean;
  subscriptionTier: 'FREE' | 'PLUS' | 'GOLD';
  createdAt: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret = process.env.JWT_SECRET || 'vyva_secret_jwt_key_2026';

  // In-memory user table (to be connected to PostgreSQL DB in production)
  private usersMap = new Map<string, UserRecord>([
    [
      'usr_me_77',
      {
        id: 'usr_me_77',
        email: 'alexandre@vyva.app',
        passwordHash: 'hashed_password_demo',
        displayName: 'Alexandre',
        gender: 'MALE',
        coins: 150,
        isVip: true,
        subscriptionTier: 'GOLD',
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  /**
   * Register a new user account
   */
  async register(dto: { email: string; password?: string; displayName: string; gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' }) {
    const { email, password, displayName, gender } = dto;

    if (!email || !displayName) {
      throw new BadRequestException('Email et nom d\'affichage requis.');
    }

    const existing = Array.from(this.usersMap.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new BadRequestException('Un compte existe déjà avec cet email.');
    }

    const userId = `usr_${Date.now()}`;
    const newUser: UserRecord = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash: password ? `hashed_${password}` : undefined,
      displayName,
      gender: gender || 'NON_BINARY',
      coins: 100, // 100 Free Welcome Coins!
      isVip: false,
      subscriptionTier: 'FREE',
      createdAt: new Date().toISOString(),
    };

    this.usersMap.set(userId, newUser);
    this.logger.log(`New user registered: ${displayName} (${userId})`);

    const token = this.generateJwt(newUser);
    return {
      success: true,
      token,
      user: this.sanitizeUser(newUser),
    };
  }

  /**
   * Login with Email & Password
   */
  async login(dto: { email: string; password?: string }) {
    const { email } = dto;
    const user = Array.from(this.usersMap.values()).find((u) => u.email.toLowerCase() === email?.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    const token = this.generateJwt(user);
    return {
      success: true,
      token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Login or Register via Google Sign-In Token
   */
  async googleAuth(dto: { googleToken: string; email?: string; displayName?: string }) {
    const email = dto.email || `google_user_${Date.now()}@gmail.com`;
    const displayName = dto.displayName || 'Utilisateur Google';

    let user = Array.from(this.usersMap.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const userId = `usr_g_${Date.now()}`;
      user = {
        id: userId,
        email: email.toLowerCase(),
        displayName,
        gender: 'NON_BINARY',
        coins: 100,
        isVip: false,
        subscriptionTier: 'FREE',
        createdAt: new Date().toISOString(),
      };
      this.usersMap.set(userId, user);
    }

    const token = this.generateJwt(user);
    return {
      success: true,
      token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Get user profile by token or ID
   */
  async getProfile(userId: string) {
    const user = this.usersMap.get(userId) || Array.from(this.usersMap.values())[0];
    if (!user) {
      throw new UnauthorizedException('Profil introuvable.');
    }
    return {
      success: true,
      user: this.sanitizeUser(user),
    };
  }

  private generateJwt(user: UserRecord): string {
    return jwt.sign(
      { sub: user.id, email: user.email, name: user.displayName },
      this.jwtSecret,
      { expiresIn: '30d' }
    );
  }

  private sanitizeUser(user: UserRecord) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

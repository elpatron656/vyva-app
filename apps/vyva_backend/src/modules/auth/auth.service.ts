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
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret = process.env.JWT_SECRET || 'vyva_secret_jwt_key_2026';

  // In-memory user table
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
        referralCode: 'VYVA-ALEX77',
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  /**
   * Register a new user account (0 coins by default, 10 coins if referred by friend)
   */
  async register(dto: {
    email: string;
    password?: string;
    displayName: string;
    gender?: 'MALE' | 'FEMALE' | 'NON_BINARY';
    referralCode?: string;
  }) {
    const { email, password, displayName, gender, referralCode } = dto;

    if (!email || !displayName) {
      throw new BadRequestException('Email et nom d\'affichage requis.');
    }

    const existing = Array.from(this.usersMap.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new BadRequestException('Un compte existe déjà avec cet email.');
    }

    const userId = `usr_${Date.now()}`;
    const userRefCode = `VYVA-${displayName.replaceAll(' ', '').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    let initialCoins = 0; // 0 coins by default at signup
    let referredByUserId: string | undefined;

    // Check referral code
    if (referralCode) {
      const referrer = Array.from(this.usersMap.values()).find(
        (u) => u.referralCode?.toUpperCase() === referralCode.trim().toUpperCase()
      );

      if (referrer) {
        // Grant +10 coins to referrer
        referrer.coins += 10;
        this.usersMap.set(referrer.id, referrer);

        // Grant +10 coins to newly referred user
        initialCoins = 10;
        referredByUserId = referrer.id;

        this.logger.log(
          `[Parrainage] User ${referrer.displayName} (${referrer.id}) referred ${displayName}! +10 Coins awarded to both.`
        );
      }
    }

    const newUser: UserRecord = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash: password ? `hashed_${password}` : undefined,
      displayName,
      gender: gender || 'NON_BINARY',
      coins: initialCoins,
      isVip: false,
      subscriptionTier: 'FREE',
      referralCode: userRefCode,
      referredBy: referredByUserId,
      createdAt: new Date().toISOString(),
    };

    this.usersMap.set(userId, newUser);
    this.logger.log(`New user registered: ${displayName} (${userId}) - Initial Coins: ${initialCoins}`);

    const token = this.generateJwt(newUser);
    return {
      success: true,
      token,
      user: this.sanitizeUser(newUser),
      referralBonusApplied: initialCoins > 0,
    };
  }

  /**
   * Login with Email & Password
   */
  async login(dto: { email: string; password?: string }) {
    const { email } = dto;
    const user = Array.from(this.usersMap.values()).find(
      (u) => u.email.toLowerCase() === email?.toLowerCase()
    );

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
  async googleAuth(dto: {
    googleToken: string;
    email?: string;
    displayName?: string;
    referralCode?: string;
  }) {
    const email = dto.email || `google_user_${Date.now()}@gmail.com`;
    const displayName = dto.displayName || 'Utilisateur Google';

    let user = Array.from(this.usersMap.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      const userId = `usr_g_${Date.now()}`;
      const userRefCode = `VYVA-${displayName.replaceAll(' ', '').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      let initialCoins = 0;
      let referredByUserId: string | undefined;

      if (dto.referralCode) {
        const referrer = Array.from(this.usersMap.values()).find(
          (u) => u.referralCode?.toUpperCase() === dto.referralCode?.trim().toUpperCase()
        );
        if (referrer) {
          referrer.coins += 10;
          this.usersMap.set(referrer.id, referrer);
          initialCoins = 10;
          referredByUserId = referrer.id;
        }
      }

      user = {
        id: userId,
        email: email.toLowerCase(),
        displayName,
        gender: 'NON_BINARY',
        coins: initialCoins,
        isVip: false,
        subscriptionTier: 'FREE',
        referralCode: userRefCode,
        referredBy: referredByUserId,
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
   * Get referral invitation link and referral code
   */
  async getReferralInfo(userId: string) {
    const user = this.usersMap.get(userId) || Array.from(this.usersMap.values())[0];
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé.');
    }

    const referralCode = user.referralCode || `VYVA-${user.id.substring(0, 6).toUpperCase()}`;
    const referralLink = `https://vyva.app/invite?ref=${referralCode}`;

    // Count referred users
    const referredCount = Array.from(this.usersMap.values()).filter(
      (u) => u.referredBy === user.id
    ).length;

    return {
      success: true,
      referralCode,
      referralLink,
      referredFriendsCount: referredCount,
      coinsEarned: referredCount * 10,
      rewardPerFriend: 10,
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

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IapController } from './modules/iap/iap.controller';
import { IapService } from './modules/iap/iap.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { MatchmakingGateway } from './modules/matchmaking/matchmaking.gateway';

@Module({
  imports: [],
  controllers: [AppController, IapController, AuthController],
  providers: [IapService, AuthService, MatchmakingGateway],
})
export class AppModule {}

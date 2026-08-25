import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IapController } from './modules/iap/iap.controller';
import { IapService } from './modules/iap/iap.service';

@Module({
  imports: [],
  controllers: [AppController, IapController],
  providers: [IapService],
})
export class AppModule {}

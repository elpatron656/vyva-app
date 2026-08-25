import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IapService, VerifyPurchaseDto } from './iap.service';

@Controller('iap')
export class IapController {
  constructor(private readonly iapService: IapService) {}

  @Get('products')
  getProducts() {
    return {
      success: true,
      storeProducts: [
        { id: 'vyva_coins_100', name: 'Pack 100 Coins', coins: 100, priceEur: 0.99, type: 'consumable' },
        { id: 'vyva_coins_500', name: 'Pack 500 Coins', coins: 500, priceEur: 4.99, type: 'consumable' },
        { id: 'vyva_coins_1200', name: 'Pack 1200 Coins', coins: 1200, priceEur: 9.99, badge: 'Popular (+20%)', type: 'consumable' },
        { id: 'vyva_coins_3000', name: 'Pack 3000 Coins', coins: 3000, priceEur: 22.99, badge: 'Best Value (+50%)', type: 'consumable' },
        { id: 'vyva_pass_30m', name: 'Pass Voyage 30 Min', priceEur: 0.99, type: 'consumable' },
        { id: 'vyva_vip_monthly', name: 'Abonnement VYVA VIP', priceEur: 9.99, type: 'subscription' },
        { id: 'vyva_gold_monthly', name: 'Abonnement VYVA GOLD', priceEur: 19.99, type: 'subscription' },
      ],
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPurchase(@Body() dto: VerifyPurchaseDto) {
    return await this.iapService.verifyPurchase(dto);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  async restorePurchases(@Body() body: { userId: string }) {
    return await this.iapService.restorePurchases(body.userId || 'usr_me_77');
  }
}

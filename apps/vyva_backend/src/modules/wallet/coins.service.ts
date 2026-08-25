/**
 * 💰 VYVA COINS & WALLET SERVICE
 * 
 * Gestion transparente de la monnaie virtuelle VYVA Coins,
 * du ledger de transactions et des achats de packs payants.
 */

export type TransactionType =
  | 'PURCHASE_100_COINS'
  | 'PURCHASE_500_COINS'
  | 'PURCHASE_1200_COINS'
  | 'PURCHASE_3000_COINS'
  | 'BOOST_PROFILE'
  | 'RECONNECT_MATCH'
  | 'TRAVEL_PASS'
  | 'SUPER_LIKE';

export interface CoinProduct {
  id: string;
  coinsCount: number;
  priceEur: number;
  badge?: string;
}

export class VyvaCoinsService {
  public static PRODUCTS: CoinProduct[] = [
    { id: 'coins_100', coinsCount: 100, priceEur: 0.99 },
    { id: 'coins_500', coinsCount: 500, priceEur: 4.99 },
    { id: 'coins_1200', coinsCount: 1200, priceEur: 9.99, badge: 'Popular (+20%)' },
    { id: 'coins_3000', coinsCount: 3000, priceEur: 22.99, badge: 'Best Value (+50%)' },
  ];

  public static FEATURE_COSTS: Record<string, number> = {
    BOOST_PROFILE: 50,
    RECONNECT_MATCH: 30,
    TRAVEL_PASS: 100,
    SUPER_LIKE: 20,
  };

  /**
   * Crédite le compte suite à un achat in-app payant validé
   */
  public creditUserCoins(
    currentBalance: number,
    amount: number
  ): number {
    if (amount <= 0) throw new Error('Amount must be positive');
    return currentBalance + amount;
  }

  /**
   * Débite le solde de Coins pour une fonctionnalité Premium ponctuelle
   */
  public spendUserCoins(
    currentBalance: number,
    featureKey: keyof typeof VyvaCoinsService.FEATURE_COSTS
  ): { newBalance: number; cost: number } {
    const cost = VyvaCoinsService.FEATURE_COSTS[featureKey];
    if (!cost) throw new Error(`Unknown feature: ${featureKey}`);

    if (currentBalance < cost) {
      throw new Error(`Insufficient coins balance. Required: ${cost}, Current: ${currentBalance}`);
    }

    return {
      newBalance: currentBalance - cost,
      cost,
    };
  }
}

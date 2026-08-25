export type TransactionType = 'PURCHASE_100_COINS' | 'PURCHASE_500_COINS' | 'PURCHASE_1200_COINS' | 'PURCHASE_3000_COINS' | 'BOOST_PROFILE' | 'RECONNECT_MATCH' | 'TRAVEL_PASS' | 'SUPER_LIKE';
export interface CoinProduct {
    id: string;
    coinsCount: number;
    priceEur: number;
    badge?: string;
}
export declare class VyvaCoinsService {
    static PRODUCTS: CoinProduct[];
    static FEATURE_COSTS: Record<string, number>;
    creditUserCoins(currentBalance: number, amount: number): number;
    spendUserCoins(currentBalance: number, featureKey: keyof typeof VyvaCoinsService.FEATURE_COSTS): {
        newBalance: number;
        cost: number;
    };
}

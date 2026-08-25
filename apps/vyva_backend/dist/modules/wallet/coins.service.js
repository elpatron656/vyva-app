"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VyvaCoinsService = void 0;
class VyvaCoinsService {
    creditUserCoins(currentBalance, amount) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        return currentBalance + amount;
    }
    spendUserCoins(currentBalance, featureKey) {
        const cost = VyvaCoinsService.FEATURE_COSTS[featureKey];
        if (!cost)
            throw new Error(`Unknown feature: ${featureKey}`);
        if (currentBalance < cost) {
            throw new Error(`Insufficient coins balance. Required: ${cost}, Current: ${currentBalance}`);
        }
        return {
            newBalance: currentBalance - cost,
            cost,
        };
    }
}
exports.VyvaCoinsService = VyvaCoinsService;
VyvaCoinsService.PRODUCTS = [
    { id: 'coins_100', coinsCount: 100, priceEur: 0.99 },
    { id: 'coins_500', coinsCount: 500, priceEur: 4.99 },
    { id: 'coins_1200', coinsCount: 1200, priceEur: 9.99, badge: 'Popular (+20%)' },
    { id: 'coins_3000', coinsCount: 3000, priceEur: 22.99, badge: 'Best Value (+50%)' },
];
VyvaCoinsService.FEATURE_COSTS = {
    BOOST_PROFILE: 50,
    RECONNECT_MATCH: 30,
    TRAVEL_PASS: 100,
    SUPER_LIKE: 20,
};
//# sourceMappingURL=coins.service.js.map
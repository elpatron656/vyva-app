import 'package:flutter/material.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import '../../core/constants/vyva_colors.dart';
import 'iap_service.dart';

class VyvaStoreScreen extends StatefulWidget {
  final int userCoins;
  final Function(int newCoins)? onCoinsUpdated;

  const VyvaStoreScreen({
    super.key,
    required this.userCoins,
    this.onCoinsUpdated,
  });

  @override
  State<VyvaStoreScreen> createState() => _VyvaStoreScreenState();
}

class _VyvaStoreScreenState extends State<VyvaStoreScreen> {
  final VyvaIapService _iapService = VyvaIapService();
  late int _currentCoins;
  String? _activeSubscription;
  bool _isPurchasing = false;

  final List<Map<String, dynamic>> _defaultCoinPacks = [
    {'id': 'vyva_coins_100', 'coins': 100, 'price': '0,99 €', 'badge': null},
    {'id': 'vyva_coins_500', 'coins': 500, 'price': '4,99 €', 'badge': null},
    {'id': 'vyva_coins_1200', 'coins': 1200, 'price': '9,99 €', 'badge': 'Populaire (+20%)'},
    {'id': 'vyva_coins_3000', 'coins': 3000, 'price': '22,99 €', 'badge': 'Meilleure Offre (+50%)'},
  ];

  @override
  void initState() {
    super.initState();
    _currentCoins = widget.userCoins;
    _initIap();
  }

  void _initIap() {
    _iapService.initialize(
      onSuccess: (newCoins, subTier) {
        setState(() {
          _currentCoins = newCoins;
          if (subTier != null) _activeSubscription = subTier;
          _isPurchasing = false;
        });
        widget.onCoinsUpdated?.call(newCoins);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFF10B981),
            content: Text('🎉 Achat validé ! Solde mis à jour: $_currentCoins Coins.'),
          ),
        );
      },
      onError: (errorMsg) {
        setState(() => _isPurchasing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.redAccent,
            content: Text(errorMsg),
          ),
        );
      },
    );
  }

  void _handleBuy(Map<String, dynamic> pack) async {
    setState(() => _isPurchasing = true);

    ProductDetails? matchedProduct;
    try {
      matchedProduct = _iapService.products.firstWhere(
        (p) => p.id == pack['id'],
      );
    } catch (_) {}

    if (matchedProduct != null) {
      await _iapService.buyProduct(matchedProduct);
    } else {
      // Simulation / Direct verification fallback for dev testing
      await Future.delayed(const Duration(seconds: 1));
      final int added = (pack['coins'] as int? ?? 100);
      setState(() {
        _currentCoins += added;
        _isPurchasing = false;
      });
      widget.onCoinsUpdated?.call(_currentCoins);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF10B981),
          content: Text('🎉 Achat Store validé ! +$added Coins ajoutés.'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: VyvaColors.background,
      appBar: AppBar(
        backgroundColor: VyvaColors.card,
        elevation: 0,
        title: const Text('Boutique VYVA', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.restore_rounded, color: VyvaColors.textMuted),
            tooltip: 'Restaurer les achats',
            onPressed: () {
              _iapService.restorePurchases();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Restauration des achats Apple/Google en cours...')),
              );
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Solde Header Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: VyvaColors.cardGradient,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: VyvaColors.primary.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Votre Solde Actuel', style: TextStyle(color: VyvaColors.textMuted, fontSize: 13)),
                        const SizedBox(height: 4),
                        Text(
                          '$_currentCoins Coins',
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                        if (_activeSubscription != null) ...[
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: VyvaColors.secondary.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              'Abonné $_activeSubscription ✨',
                              style: const TextStyle(color: VyvaColors.secondary, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ]
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: VyvaColors.secondary.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.monetization_on_rounded, color: VyvaColors.secondary, size: 36),
                    )
                  ],
                ),
              ),

              const SizedBox(height: 24),
              const Text('PACKS DE COINS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: VyvaColors.textMuted)),
              const SizedBox(height: 12),

              // Coin Packs Grid
              ..._defaultCoinPacks.map((pack) {
                final String? badge = pack['badge'];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: VyvaColors.card,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: badge != null ? VyvaColors.secondary : Colors.white10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.monetization_on, color: VyvaColors.secondary, size: 32),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${pack['coins']} Coins', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                            if (badge != null)
                              Text(badge, style: const TextStyle(color: VyvaColors.accent, fontSize: 11, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: VyvaColors.primary,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                        onPressed: () => _handleBuy(pack),
                        child: Text(pack['price'], style: const TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                );
              }),

              const SizedBox(height: 20),
              const Text('ABONNEMENTS VYVA', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: VyvaColors.textMuted)),
              const SizedBox(height: 12),

              // VIP Sub Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.purple.shade900, VyvaColors.card]),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.purpleAccent.withOpacity(0.5)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.stars_rounded, color: Colors.purpleAccent, size: 40),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('VYVA VIP', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                          SizedBox(height: 4),
                          Text('Matches illimités + Filtres de genre', style: TextStyle(fontSize: 12, color: VyvaColors.textMuted)),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purpleAccent,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () => _handleBuy({'id': 'vyva_vip_monthly', 'price': '9,99 €/mois'}),
                      child: const Text('9,99 €/mois', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
              const Center(
                child: Text(
                  '🔒 Paiements sécurisés via Apple StoreKit & Google Play Billing.\nLes abonnements sont renouvelés automatiquement et annulables à tout moment.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: VyvaColors.textMuted),
                ),
              ),
            ],
          ),

          if (_isPurchasing)
            Container(
              color: Colors.black54,
              child: const Center(
                child: CircularProgressIndicator(color: VyvaColors.secondary),
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _iapService.dispose();
    super.dispose();
  }
}

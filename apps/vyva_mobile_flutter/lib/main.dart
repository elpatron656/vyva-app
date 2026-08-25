import 'package:flutter/material.dart';
import 'core/constants/vyva_colors.dart';
import 'features/store/store_screen.dart';

void main() {
  runApp(const VyvaApp());
}

class VyvaApp extends StatelessWidget {
  const VyvaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VYVA',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: VyvaColors.background,
        cardColor: VyvaColors.card,
        primaryColor: VyvaColors.primary,
        colorScheme: const ColorScheme.dark(
          primary: VyvaColors.primary,
          secondary: VyvaColors.secondary,
          surface: VyvaColors.card,
          background: VyvaColors.background,
        ),
      ),
      home: const VyvaHomeScreen(),
    );
  }
}

class VyvaHomeScreen extends StatefulWidget {
  const VyvaHomeScreen({super.key});

  @override
  State<VyvaHomeScreen> createState() => _VyvaHomeScreenState();
}

class _VyvaHomeScreenState extends State<VyvaHomeScreen> {
  int _currentIndex = 0;
  int _userCoins = 150;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: _currentIndex,
          children: [
            _buildMatchCenter(),
            const Center(child: Text("Chat & Matchs")),
            VyvaStoreScreen(
              userCoins: _userCoins,
              onCoinsUpdated: (newCoins) => setState(() => _userCoins = newCoins),
            ),
            const Center(child: Text("Profil Utilisateur")),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        backgroundColor: VyvaColors.card,
        selectedItemColor: VyvaColors.secondary,
        unselectedItemColor: VyvaColors.textMuted,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.videocam_rounded), label: 'Match'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_rounded), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_rounded), label: 'Boutique'),
          BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profil'),
        ],
      ),
    );
  }

  Widget _buildMatchCenter() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ShaderMask(
                shaderCallback: (bounds) => VyvaColors.primaryGradient.createShader(bounds),
                child: const Text(
                  'VYVA',
                  style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white),
                ),
              ),
              GestureDetector(
                onTap: () => setState(() => _currentIndex = 2), // Go to Boutique
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: VyvaColors.card,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: VyvaColors.secondary.withOpacity(0.4)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.monetization_on, color: VyvaColors.secondary, size: 18),
                      const SizedBox(width: 6),
                      Text('$_userCoins Coins', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Central Pulse Button
          GestureDetector(
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Recherche de partenaire VYVA MATCH AI en cours...')),
              );
            },
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: VyvaColors.primaryGradient,
                boxShadow: [
                  BoxShadow(
                    color: VyvaColors.primary.withOpacity(0.5),
                    blurRadius: 30,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.videocam_rounded, size: 48, color: Colors.white),
                  SizedBox(height: 8),
                  Text(
                    'COMMENCER',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 1),
                  ),
                ],
              ),
            ),
          ),

          // Filters Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: VyvaColors.card,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white10),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'QUI VEUX-TU RENCONTRER ?',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: VyvaColors.textMuted),
                ),
                SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Text('👩 Femmes', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('👨 Hommes', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('🌎 Tous', style: TextStyle(fontWeight: FontWeight.bold, color: VyvaColors.secondary)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

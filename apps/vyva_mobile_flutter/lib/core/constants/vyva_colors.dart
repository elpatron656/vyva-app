import 'package:flutter/material.dart';

class VyvaColors {
  static const Color primary = Color(0xFF7C3AED); // Violet électrique
  static const Color secondary = Color(0xFFFF4F81); // Rose corail
  static const Color accent = Color(0xFFFF7EB3); // Rose clair
  static const Color background = Color(0xFF09090B); // Noir profond
  static const Color card = Color(0xFF18181B); // Cartes
  static const Color textMain = Color(0xFFFFFFFF);
  static const Color textMuted = Color(0xFFA1A1AA);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, secondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

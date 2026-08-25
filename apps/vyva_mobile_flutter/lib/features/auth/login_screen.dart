import 'package:flutter/material.dart';
import '../../core/constants/vyva_colors.dart';
import 'auth_service.dart';

class VyvaLoginScreen extends StatefulWidget {
  final Function(Map<String, dynamic> user)? onLoginSuccess;

  const VyvaLoginScreen({super.key, this.onLoginSuccess});

  @override
  State<VyvaLoginScreen> createState() => _VyvaLoginScreenState();
}

class _VyvaLoginScreenState extends State<VyvaLoginScreen> {
  final VyvaAuthService _authService = VyvaAuthService();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();

  bool _isRegisterMode = false;
  bool _isLoading = false;

  void _submitAuth() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final name = _nameController.text.trim();

    if (email.isEmpty || password.isEmpty || (_isRegisterMode && name.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs obligatoires.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    Map<String, dynamic> result;
    if (_isRegisterMode) {
      result = await _authService.register(
        email: email,
        password: password,
        displayName: name,
      );
    } else {
      result = await _authService.login(
        email: email,
        password: password,
      );
    }

    setState(() => _isLoading = false);

    if (result['success'] == true) {
      widget.onLoginSuccess?.call(result['user']);
      if (mounted) {
        Navigator.of(context).pop();
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(backgroundColor: Colors.redAccent, content: Text(result['message'] ?? 'Erreur')),
        );
      }
    }
  }

  void _handleGoogleSignIn() async {
    setState(() => _isLoading = true);
    final result = await _authService.googleSignIn(
      googleToken: 'mock_google_id_token_${DateTime.now().millisecondsSinceEpoch}',
      email: 'alexandre.vyva@gmail.com',
      displayName: 'Alexandre',
    );
    setState(() => _isLoading = false);

    if (result['success'] == true) {
      widget.onLoginSuccess?.call(result['user']);
      if (mounted) {
        Navigator.of(context).pop();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: VyvaColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                Center(
                  child: ShaderMask(
                    shaderCallback: (bounds) => VyvaColors.primaryGradient.createShader(bounds),
                    child: const Text(
                      'VYVA',
                      style: TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Center(
                  child: Text(
                    'Rencontres Vidéo Instantanées & Authentiques',
                    style: TextStyle(color: VyvaColors.textMuted, fontSize: 13),
                  ),
                ),
                const SizedBox(height: 40),

                // Google Button
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black87,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  ),
                  onPressed: _handleGoogleSignIn,
                  icon: const Icon(Icons.g_mobiledata_rounded, size: 28, color: Colors.redAccent),
                  label: const Text(
                    'Continuer avec Google',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                ),

                const SizedBox(height: 24),
                const Row(
                  children: [
                    Expanded(child: Divider(color: Colors.white24)),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12),
                      child: Text('OU', style: TextStyle(color: VyvaColors.textMuted, fontSize: 12)),
                    ),
                    Expanded(child: Divider(color: Colors.white24)),
                  ],
                ),
                const SizedBox(height: 24),

                if (_isRegisterMode) ...[
                  TextField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      labelText: 'Prénom ou Pseudo',
                      filled: true,
                      fillColor: VyvaColors.card,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 14),
                ],

                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: 'Adresse Email',
                    filled: true,
                    fillColor: VyvaColors.card,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 14),

                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Mot de passe',
                    filled: true,
                    fillColor: VyvaColors.card,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 24),

                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: VyvaColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  ),
                  onPressed: _isLoading ? null : _submitAuth,
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          _isRegisterMode ? 'CRÉER MON COMPTE' : 'SE CONNECTER',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                ),

                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => setState(() => _isRegisterMode = !_isRegisterMode),
                  child: Text(
                    _isRegisterMode ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire',
                    style: const TextStyle(color: VyvaColors.secondary, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

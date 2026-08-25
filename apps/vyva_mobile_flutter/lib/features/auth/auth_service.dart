import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class VyvaAuthService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://vyva-uura.onrender.com',
    connectTimeout: const Duration(seconds: 10),
  ));

  /// Register user with Email, Password & Display Name
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String displayName,
    String gender = 'NON_BINARY',
  }) async {
    try {
      final response = await _dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        'displayName': displayName,
        'gender': gender,
      });

      if (response.statusCode == 201 && response.data['token'] != null) {
        await _saveToken(response.data['token']);
        return {'success': true, 'user': response.data['user']};
      }
      return {'success': false, 'message': 'Erreur lors de la création du compte.'};
    } catch (e) {
      return {'success': false, 'message': 'Impossible de contacter le serveur VYVA.'};
    }
  }

  /// Login with Email & Password
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200 && response.data['token'] != null) {
        await _saveToken(response.data['token']);
        return {'success': true, 'user': response.data['user']};
      }
      return {'success': false, 'message': 'Identifiants incorrects.'};
    } catch (e) {
      return {'success': false, 'message': 'Connexion au serveur échouée.'};
    }
  }

  /// Google One-Tap Sign In
  Future<Map<String, dynamic>> googleSignIn({
    required String googleToken,
    String? email,
    String? displayName,
  }) async {
    try {
      final response = await _dio.post('/auth/google', data: {
        'googleToken': googleToken,
        'email': email,
        'displayName': displayName,
      });

      if (response.statusCode == 200 && response.data['token'] != null) {
        await _saveToken(response.data['token']);
        return {'success': true, 'user': response.data['user']};
      }
      return {'success': false, 'message': 'Connexion Google échouée.'};
    } catch (e) {
      return {'success': false, 'message': 'Erreur serveur Google Sign-In.'};
    }
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('vyva_jwt_token', token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('vyva_jwt_token');
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('vyva_jwt_token');
  }
}

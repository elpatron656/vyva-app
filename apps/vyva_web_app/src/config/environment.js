/**
 * ⚙️ VYVA ENVIRONMENT CONFIGURATION
 * 
 * Centralized configuration for Web, Android, and iOS.
 * Supports Development and Production mode.
 */

export const ENV = {
  appName: 'VYVA',
  version: '1.0.0',
  buildNumber: 1,
  appId: 'com.vyva.app',

  // Native Capacitor platform detection
  isNative: typeof window !== 'undefined' && Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()),
  platform: typeof window !== 'undefined' && window.Capacitor?.getPlatform ? window.Capacitor.getPlatform() : 'web',

  // Production vs Development flag
  isProduction: import.meta.env.PROD || false,

  // Configurable URLs via Vite environment variables (.env / .env.production)
  apiBaseUrl: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://api.vyva.app' : 'https://192.168.1.74:3000'),
  signalingUrl: import.meta.env.VITE_SIGNALING_URL || (import.meta.env.PROD ? 'wss://signaling.vyva.app' : 'wss://192.168.1.74:3000'),

  // Store & Monétisation
  currencySymbol: '€',
  passPrice30Min: 0.99
};

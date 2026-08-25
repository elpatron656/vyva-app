import React from 'react';
import { QrCode, X, Smartphone, Wifi, ExternalLink, Lock } from 'lucide-react';

export default function MobileQrModal({ onClose }) {
  const localHttpsUrl = "https://192.168.1.74:3000";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(localHttpsUrl)}&color=FF4F81&bgcolor=18181B`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 9, 11, 0.92)',
      backdropFilter: 'blur(20px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#fff'
    }}>
      <div className="vyva-card" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '24px',
        textAlign: 'center',
        background: '#18181B',
        borderColor: 'var(--vyva-secondary)',
        boxShadow: 'var(--vyva-shadow-pink)',
        position: 'relative'
      }}>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--vyva-gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto'
        }}>
          <Smartphone size={24} color="#fff" />
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '4px' }}>
          Tester VYVA sur Téléphone (HTTPS) 📲
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--vyva-text-muted)', marginBottom: '16px' }}>
          Scannez le QR Code ci-dessous avec l'appareil photo de votre smartphone (iPhone ou Android)
        </p>

        {/* QR Code Container */}
        <div style={{
          background: '#09090B',
          padding: '16px',
          borderRadius: '20px',
          display: 'inline-block',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '16px'
        }}>
          <img
            src={qrImageUrl}
            alt="Scan QR Code to test on Mobile"
            style={{ width: '200px', height: '200px', borderRadius: '12px' }}
          />
        </div>

        {/* Direct HTTPS Link Info */}
        <div style={{
          background: 'rgba(124, 58, 237, 0.15)',
          padding: '12px',
          borderRadius: '16px',
          border: '1px solid var(--vyva-primary)',
          fontSize: '12px',
          marginBottom: '16px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: '#10B981', marginBottom: '4px' }}>
            <Lock size={14} /> Connexion HTTPS Sécurisée pour Caméra
          </div>
          <div style={{ color: 'var(--vyva-text-muted)', fontSize: '11px', lineHeight: '1.4' }}>
            Pour autoriser la caméra sur Safari/Chrome mobile, le lien HTTPS sécurisé ci-dessous est requis. Acceptez le certificat de test au premier accès :
          </div>
          <div style={{
            background: '#000',
            padding: '8px 12px',
            borderRadius: '10px',
            marginTop: '8px',
            fontSize: '13px',
            fontWeight: '900',
            color: '#10B981',
            letterSpacing: '0.5px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}>
            <span>{localHttpsUrl}</span>
            <ExternalLink size={14} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary-gradient"
          style={{ width: '100%', padding: '12px', borderRadius: '99px', fontSize: '14px' }}
        >
          Fermer
        </button>

      </div>
    </div>
  );
}

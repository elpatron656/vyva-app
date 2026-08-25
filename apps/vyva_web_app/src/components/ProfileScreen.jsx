import React from 'react';
import { User, Shield, Crown, Award, BarChart3, Settings, HelpCircle, Lock, Trash2, Heart, Video } from 'lucide-react';

export default function ProfileScreen({ user, onOpenStore }) {
  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%', color: '#fff' }}>
      
      {/* User Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0 24px 0' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--vyva-secondary)',
              boxShadow: 'var(--vyva-shadow-pink)'
            }}
          />
          {user.isPremium && (
            <span className="badge-premium" style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px' }}>
              {user.premiumTier}
            </span>
          )}
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', marginTop: '12px' }}>{user.displayName}, 24</h2>
        <div style={{ fontSize: '13px', color: 'var(--vyva-text-muted)', marginTop: '2px' }}>🇫🇷 France • Membre Vérifié 18+</div>
      </div>

      {/* User Stats Summary */}
      <div className="vyva-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px', gap: '10px', textAlign: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--vyva-secondary)' }}>128</div>
          <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)' }}>Rencontres</div>
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--vyva-primary)' }}>42</div>
          <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)' }}>Matchs</div>
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--vyva-accent)' }}>94%</div>
          <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)' }}>Score Qualité</div>
        </div>
      </div>

      {/* Premium Upgrade Banner */}
      {!user.isPremium && (
        <div className="vyva-card" onClick={onOpenStore} style={{
          background: 'var(--vyva-gradient-primary)',
          cursor: 'pointer',
          marginBottom: '20px',
          padding: '16px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800' }}>Passer à VYVA Plus / Gold</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Filtres avancés, Mode Travel & Plus</div>
          </div>
          <Crown size={24} color="#fff" />
        </div>
      )}

      {/* Settings & Security Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="vyva-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <Shield size={20} color="#10B981" />
          <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>Sécurité & Vérification d'âge (18+)</div>
        </div>

        <div className="vyva-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <Lock size={20} color="#FF7EB3" />
          <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>Confidentialité & Données RGPD</div>
        </div>

        <div className="vyva-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <HelpCircle size={20} color="#F59E0B" />
          <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>Centre d'aide & Signalement</div>
        </div>

        <div className="vyva-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#EF4444' }}>
          <Trash2 size={20} color="#EF4444" />
          <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>Supprimer mon compte (RGPD Art. 17)</div>
        </div>
      </div>

    </div>
  );
}

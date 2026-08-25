import React, { useState } from 'react';
import { Coins, Crown, Check, Sparkles, ShieldCheck, Lock } from 'lucide-react';

export default function StoreScreen({ user, onAddCoins, onUpgradeSubscription }) {
  const [activeTab, setActiveTab] = useState('COINS'); // 'COINS', 'PREMIUM'

  const COIN_PACKS = [
    { id: '100', coins: 100, price: '0,99 €', badge: null },
    { id: '500', coins: 500, price: '4,99 €', badge: null },
    { id: '1200', coins: 1200, price: '9,99 €', badge: 'Populaire (+20%)' },
    { id: '3000', coins: 3000, price: '22,99 €', badge: 'Meilleur Prix (+50%)' }
  ];

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%', color: '#fff' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Boutique VYVA</h2>
        <div style={{
          background: 'var(--vyva-card)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 79, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '800',
          fontSize: '13px'
        }}>
          <Coins color="#FF4F81" size={16} />
          <span>{user.coins} Coins</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="vyva-card" style={{ padding: '4px', display: 'flex', gap: '4px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('COINS')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '16px',
            border: 'none',
            background: activeTab === 'COINS' ? 'var(--vyva-gradient-primary)' : 'transparent',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          🪙 Packs de Coins
        </button>
        <button
          onClick={() => setActiveTab('PREMIUM')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '16px',
            border: 'none',
            background: activeTab === 'PREMIUM' ? 'var(--vyva-gradient-primary)' : 'transparent',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Crown size={15} color="#FF7EB3" /> Abonnements
        </button>
      </div>

      {activeTab === 'COINS' ? (
        <div>
          {/* Paid Currency Info Banner */}
          <div className="vyva-card" style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(255, 79, 129, 0.15) 100%)',
            borderColor: 'rgba(255, 79, 129, 0.3)',
            marginBottom: '20px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>
              <Lock size={16} color="#FF4F81" /> Système 100% Payant & Sécurisé
            </div>
            <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)', lineHeight: '1.4' }}>
              Les VYVA Coins s'achètent uniquement par paiement direct sécurisé. Ils vous permettent d'activer les Pass Pays International 30 min et des options exclusives.
            </div>
          </div>

          {/* Coins Packs List */}
          <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--vyva-text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Acheter des Packs de Coins
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {COIN_PACKS.map((pack) => (
              <div
                key={pack.id}
                className="vyva-card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px',
                  borderColor: pack.badge ? 'var(--vyva-secondary)' : 'rgba(255,255,255,0.08)'
                }}
              >
                {pack.badge && (
                  <span className="badge-premium" style={{ position: 'absolute', top: '-10px', fontSize: '9px', padding: '3px 8px' }}>
                    {pack.badge}
                  </span>
                )}
                <Coins size={32} color="#FF4F81" style={{ margin: '8px 0' }} />
                <div style={{ fontSize: '20px', fontWeight: '900' }}>{pack.coins} Coins</div>
                <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)', marginBottom: '14px' }}>VYVA Currency</div>
                <button
                  onClick={() => onAddCoins(pack.coins)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '14px',
                    border: 'none',
                    background: pack.badge ? 'var(--vyva-gradient-primary)' : '#27272A',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Acheter ({pack.price})
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--vyva-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#10B981" /> Paiements sécurisés via Apple Pay, Google Pay & CB
          </div>
        </div>
      ) : (
        /* PREMIUM PLANS TAB */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* VYVA PLUS CARD */}
          <div className="vyva-card" style={{ padding: '20px', borderColor: 'var(--vyva-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span className="badge-premium">VYVA PLUS</span>
                <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '6px' }}>9,99 € / mois</div>
              </div>
              <Crown color="#7C3AED" size={32} />
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Filtre de genre (Mode Hommes / Femmes)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Zéro publicité entre les matchs</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Sélection de pays (VYVA Travel)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> 200 Coins inclus chaque mois</li>
            </ul>

            <button
              onClick={() => onUpgradeSubscription('PLUS')}
              className="btn-primary-gradient"
              style={{ width: '100%', padding: '12px' }}
            >
              Abonnement VYVA Plus (9,99 €)
            </button>
          </div>

          {/* VYVA GOLD CARD */}
          <div className="vyva-card" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
            borderColor: '#F59E0B'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span className="badge-gold">VYVA GOLD VIP</span>
                <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '6px' }}>19,99 € / mois</div>
              </div>
              <Sparkles color="#F59E0B" size={32} />
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#F59E0B" /> Tout VYVA Plus inclus</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#F59E0B" /> Priorité Absolue dans le matchmaking AI ⭐</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#F59E0B" /> Badge VIP Gold exclusif sur le profil</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#F59E0B" /> 600 Coins inclus chaque mois</li>
            </ul>

            <button
              onClick={() => onUpgradeSubscription('GOLD')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '99px',
                border: 'none',
                background: 'var(--vyva-gradient-gold)',
                color: '#000',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Abonnement VYVA Gold (19,99 €)
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

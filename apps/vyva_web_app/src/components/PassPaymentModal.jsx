import React, { useState } from 'react';
import { Globe, X, CreditCard, Coins, ShieldCheck, Sparkles, Check, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PassPaymentModal({ country, user, onPassActivated, onClose, onOpenStore }) {
  const [paymentMethod, setPaymentMethod] = useState('CARD'); // 'CARD' or 'COINS'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const PASS_PRICE_EUR = '0,99 €';
  const PASS_PRICE_COINS = 100;
  const DURATION_MINUTES = 30;

  const handlePayAndActivate = () => {
    if (paymentMethod === 'COINS' && user.coins < PASS_PRICE_COINS) {
      alert(`⚠️ Solde insuffisant ! Vous avez ${user.coins} Coins mais ce pass requiert ${PASS_PRICE_COINS} Coins. Redirection vers la boutique...`);
      onOpenStore();
      onClose();
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log("Confetti effect executed");
      }

      // Activate Pass Callback
      setTimeout(() => {
        onPassActivated(country, DURATION_MINUTES, paymentMethod === 'COINS' ? PASS_PRICE_COINS : 0);
      }, 1200);

    }, 1000);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(9, 9, 11, 0.94)',
      backdropFilter: 'blur(18px)',
      zIndex: 140,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      color: '#fff'
    }}>
      
      {/* Top Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-premium" style={{ background: 'var(--vyva-gradient-primary)' }}>VYVA TRAVEL PASS</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Hero Banner for Country Pass */}
        <div className="vyva-card" style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(255, 79, 129, 0.25) 100%)',
          borderColor: 'var(--vyva-secondary)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '54px', marginBottom: '8px' }}>{country.flag}</div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '4px' }}>
            Pass Rencontres {country.name}
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--vyva-accent)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Timer size={16} /> 30 Minutes d'accès exclusif
          </div>
        </div>
      </div>

      {/* Pass Perks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>✓</div>
          <span>Croisez en priorité des célibataires situés en <b>{country.name}</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>✓</div>
          <span>Compte à rebours en temps réel de <b>30:00 minutes</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>✓</div>
          <span>Retour automatique en France une fois les 30 min écoulées</span>
        </div>
      </div>

      {/* Payment Selector: Card vs Coins */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--vyva-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Choisissez votre mode de paiement :
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          
          {/* Option 1: Card 0,99€ */}
          <button
            onClick={() => setPaymentMethod('CARD')}
            style={{
              padding: '14px',
              borderRadius: '18px',
              border: '2px solid ' + (paymentMethod === 'CARD' ? 'var(--vyva-secondary)' : 'rgba(255,255,255,0.08)'),
              background: paymentMethod === 'CARD' ? 'rgba(255, 79, 129, 0.15)' : 'var(--vyva-card)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CreditCard size={22} color={paymentMethod === 'CARD' ? "#FF4F81" : "#fff"} />
            <span style={{ fontSize: '16px', fontWeight: '900' }}>0,99 €</span>
            <span style={{ fontSize: '10px', color: 'var(--vyva-text-muted)' }}>Paiement CB / Apple Pay</span>
          </button>

          {/* Option 2: Coins (100 coins) */}
          <button
            onClick={() => setPaymentMethod('COINS')}
            style={{
              padding: '14px',
              borderRadius: '18px',
              border: '2px solid ' + (paymentMethod === 'COINS' ? 'var(--vyva-primary)' : 'rgba(255,255,255,0.08)'),
              background: paymentMethod === 'COINS' ? 'rgba(124, 58, 237, 0.15)' : 'var(--vyva-card)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Coins size={22} color={paymentMethod === 'COINS' ? "#7C3AED" : "#fff"} />
            <span style={{ fontSize: '16px', fontWeight: '900' }}>100 Coins</span>
            <span style={{ fontSize: '10px', color: 'var(--vyva-text-muted)' }}>Solde: {user.coins} Coins</span>
          </button>

        </div>

        {/* Security & Action Button */}
        <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '11px', color: 'var(--vyva-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#10B981" /> Paiement 100% Sécurisé & Accès Immédiat 30 Min
        </div>

        <button
          onClick={handlePayAndActivate}
          disabled={isProcessing || isSuccess}
          className="btn-primary-gradient"
          style={{ width: '100%', padding: '16px', borderRadius: '99px', fontSize: '16px' }}
        >
          {isProcessing ? (
            <span>Traitement du paiement... ⏳</span>
          ) : isSuccess ? (
            <span>🎉 Pass {country.name} Actif (30 min) !</span>
          ) : (
            <span>Activer pour 30 Minutes ({paymentMethod === 'CARD' ? PASS_PRICE_EUR : `${PASS_PRICE_COINS} Coins`})</span>
          )}
        </button>
      </div>

    </div>
  );
}

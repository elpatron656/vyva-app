import React, { useState } from 'react';
import { Gamepad2, X, CheckCircle2, Flame } from 'lucide-react';

export default function VyvaGamesModal({ onClose }) {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [partnerChoice, setPartnerChoice] = useState(null);

  const GAMES = [
    { title: "Plage ou Montagne ?", optionA: "🏝️ Plage", optionB: "🏔️ Montagne" },
    { title: "Matin ou Nuit ?", optionA: "🌅 Matin", optionB: "🌙 Nuit" },
    { title: "Pizza ou Burger ?", optionA: "🍕 Pizza", optionB: "🍔 Burger" }
  ];

  const currentGame = GAMES[currentGameIndex];

  const handleSelectOption = (option) => {
    setUserChoice(option);
    // Simulate partner picking response after 0.8s
    setTimeout(() => {
      const partnerPick = Math.random() > 0.3 ? option : (option === currentGame.optionA ? currentGame.optionB : currentGame.optionA);
      setPartnerChoice(partnerPick);
    }, 800);
  };

  const handleNextGame = () => {
    setUserChoice(null);
    setPartnerChoice(null);
    setCurrentGameIndex((prev) => (prev + 1) % GAMES.length);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(9, 9, 11, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 50,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gamepad2 color="#FF7EB3" size={24} />
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>VYVA GAMES</h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
      </div>

      <div style={{ textAlign: 'center', margin: 'auto 0' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--vyva-secondary)',
          textTransform: 'uppercase',
          marginBottom: '8px',
          letterSpacing: '1px'
        }}>
          Question {currentGameIndex + 1} / {GAMES.length}
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '30px' }}>
          {currentGame.title}
        </h2>

        {!userChoice ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <button
              onClick={() => handleSelectOption(currentGame.optionA)}
              style={{
                padding: '18px',
                borderRadius: '20px',
                border: '2px solid rgba(255, 255, 255, 0.12)',
                background: 'var(--vyva-card)',
                color: '#fff',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {currentGame.optionA}
            </button>
            <button
              onClick={() => handleSelectOption(currentGame.optionB)}
              style={{
                padding: '18px',
                borderRadius: '20px',
                border: '2px solid rgba(255, 255, 255, 0.12)',
                background: 'var(--vyva-card)',
                color: '#fff',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {currentGame.optionB}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div className="vyva-card" style={{ width: '100%', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--vyva-text-muted)', marginBottom: '4px' }}>Ton choix</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--vyva-accent)' }}>{userChoice}</div>
            </div>

            {partnerChoice ? (
              <div className="vyva-card" style={{
                width: '100%',
                padding: '20px',
                borderColor: userChoice === partnerChoice ? 'var(--vyva-secondary)' : 'rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '13px', color: 'var(--vyva-text-muted)', marginBottom: '4px' }}>Son choix</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{partnerChoice}</div>

                {userChoice === partnerChoice && (
                  <div style={{
                    marginTop: '12px',
                    color: '#10B981',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <Flame color="#10B981" size={18} /> C'est un Match de réponses ! 🎉
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: 'var(--vyva-text-muted)' }}>En attente de la réponse de ton partenaire...</div>
            )}

            {partnerChoice && (
              <button
                className="btn-primary-gradient"
                onClick={handleNextGame}
                style={{ width: '100%', marginTop: '10px' }}
              >
                Question Suivante
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--vyva-text-muted)' }}>
        Répondez simultanément pour découvrir votre compatibilité !
      </div>
    </div>
  );
}

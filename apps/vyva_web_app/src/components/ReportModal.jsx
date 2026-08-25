import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ReportModal({ reportedUser, onClose, onSubmitReport }) {
  const [reason, setReason] = useState('NUDITY_OR_EXPLICIT');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const REASONS = [
    { id: 'NUDITY_OR_EXPLICIT', label: '🔞 Nudité ou contenu explicite' },
    { id: 'HARASSMENT_OR_BULLYING', label: '🤬 Harcèlement ou propos haineux' },
    { id: 'UNDERAGE_USER', label: '🔞 Mineur (Moins de 18 ans)' },
    { id: 'SPAM_OR_FAKE', label: '🤖 Faux profil / Bot / Spam' },
    { id: 'OTHER', label: '⚠️ Autre comportement inapproprié' }
  ];

  const handleSubmit = () => {
    onSubmitReport({ reportedUser, reason, comment });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(9, 9, 11, 0.94)',
      backdropFilter: 'blur(20px)',
      zIndex: 90,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444' }}>
          <ShieldAlert size={24} />
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>Signaler / Bloquer</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          <div style={{ fontSize: '14px', color: 'var(--vyva-text-muted)' }}>
            Motif du signalement concernant <strong style={{ color: '#fff' }}>{reportedUser.name}</strong> :
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {REASONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                className="vyva-card"
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderColor: reason === r.id ? '#EF4444' : 'rgba(255,255,255,0.08)',
                  background: reason === r.id ? 'rgba(239, 68, 68, 0.15)' : 'var(--vyva-card)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Détails supplémentaires (facultatif)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              height: '80px',
              borderRadius: '16px',
              padding: '12px',
              background: 'var(--vyva-card)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              outline: 'none',
              fontSize: '13px',
              marginTop: '10px'
            }}
          />

          <button
            onClick={handleSubmit}
            style={{
              marginTop: 'auto',
              width: '100%',
              padding: '14px',
              borderRadius: '99px',
              border: 'none',
              background: '#EF4444',
              color: '#fff',
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Bloquer & Envoyer le Signalement 🚫
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
          <CheckCircle2 size={54} color="#10B981" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '6px' }}>Signalement transmis</h3>
          <p style={{ fontSize: '13px', color: 'var(--vyva-text-muted)', maxWidth: '280px' }}>
            L'utilisateur a été immédiatement bloqué. Notre équipe de modération inspecte ce profil.
          </p>
        </div>
      )}
    </div>
  );
}

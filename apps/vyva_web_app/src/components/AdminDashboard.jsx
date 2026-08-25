import React, { useState } from 'react';
import { Users, Video, ShieldAlert, DollarSign, TrendingUp, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function AdminDashboard({ onExitAdmin }) {
  const [reports, setReports] = useState([
    { id: 'rep_101', reportedUser: 'User_8921 (Marc, 24)', reporter: 'User_4410', reason: 'NUDITY_OR_EXPLICIT', time: 'Il y a 4 min', status: 'PENDING', snapshot: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
    { id: 'rep_102', reportedUser: 'User_3312 (Kevin, 29)', reporter: 'User_9012', reason: 'HARASSMENT', time: 'Il y a 12 min', status: 'PENDING', snapshot: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' }
  ]);

  const handleResolveReport = (id, action) => {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#09090B', minHeight: '100vh', color: '#fff' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onExitAdmin}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: '#18181B',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '700'
            }}
          >
            <ArrowLeft size={16} /> Mode App Mobile
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '900', background: 'var(--vyva-gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            VYVA ADMIN DASHBOARD
          </h1>
        </div>

        <span style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontWeight: '700', fontSize: '12px' }}>
          ● Live Production Cluster (v1.0.0)
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        
        <div className="vyva-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--vyva-text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>UTILISATEURS ACTIFS (DAU)</span>
            <Users size={18} color="#7C3AED" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900' }}>14,280</div>
          <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontWeight: '700' }}>+18.4% ce mois</div>
        </div>

        <div className="vyva-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--vyva-text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>APPELS VIDÉO HORS PAIR</span>
            <Video size={18} color="#FF4F81" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900' }}>89,450</div>
          <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)', marginTop: '4px' }}>Durée moy : 4m 12s</div>
        </div>

        <div className="vyva-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--vyva-text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>REVENUS DU JOUR</span>
            <DollarSign size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900' }}>3,420 €</div>
          <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontWeight: '700' }}>Coins & Abonnements</div>
        </div>

        <div className="vyva-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--vyva-text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>SIGNALEMENTS EN ATTENTE</span>
            <ShieldAlert size={18} color="#EF4444" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#EF4444' }}>{reports.filter(r => r.status === 'PENDING').length}</div>
          <div style={{ fontSize: '11px', color: 'var(--vyva-text-muted)', marginTop: '4px' }}>Temps d'action moy : 1.2 min</div>
        </div>

      </div>

      {/* Moderation Live Queue Section */}
      <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldAlert color="#EF4444" size={20} /> Queue de Modération Vidéo en Direct
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="vyva-card"
            style={{
              padding: '16px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              opacity: rep.status !== 'PENDING' ? 0.5 : 1
            }}
          >
            <img
              src={rep.snapshot}
              alt="Snapshot"
              style={{ width: '80px', height: '80px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #EF4444' }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '16px' }}>{rep.reportedUser}</span>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', fontWeight: '700' }}>
                  {rep.reason}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--vyva-text-muted)', marginTop: '4px' }}>
                Signalé par {rep.reporter} • {rep.time}
              </div>
              {rep.status !== 'PENDING' && (
                <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '6px', color: rep.status === 'BANNED' ? '#EF4444' : '#10B981' }}>
                  Statut : {rep.status === 'BANNED' ? '🚫 Utilisateur Banni' : '✅ Rejeté / Classé'}
                </div>
              )}
            </div>

            {rep.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleResolveReport(rep.id, 'DISMISSED')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: '#27272A',
                    color: '#fff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Classer sans suite
                </button>
                <button
                  onClick={() => handleResolveReport(rep.id, 'BANNED')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#EF4444',
                    color: '#fff',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Bannir l'utilisateur 🚫
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

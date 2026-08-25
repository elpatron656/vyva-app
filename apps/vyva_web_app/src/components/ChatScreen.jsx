import React, { useState } from 'react';
import { Send, Image, MoreVertical, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ChatScreen({ matches, onOpenReport }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatHistory, setChatHistory] = useState({});

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedMatch) return;

    const matchId = selectedMatch.id;
    const newMsg = {
      id: Date.now(),
      sender: 'ME',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg]
    }));

    setMessageInput('');

    // Simulate response
    setTimeout(() => {
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'PARTNER',
        text: ['Super de t’avoir rencontré sur VYVA ! 😊', 'Tu fais quoi ce soir ?', 'Haha trop cool la fonction Mystery Match !'][Math.floor(Math.random() * 3)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), replyMsg]
      }));
    }, 1200);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      
      {!selectedMatch ? (
        /* Match List View */
        <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px' }}>Tes Matchs & Messages</h2>

          {matches.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--vyva-text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Aucun match pour le moment</div>
              <div style={{ fontSize: '13px' }}>Lance un appel vidéo vidéo et liker des personnes pour discuter ici !</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {matches.map((m) => (
                <div
                  key={m.id}
                  className="vyva-card"
                  onClick={() => setSelectedMatch(m)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--vyva-secondary)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800' }}>{m.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--vyva-text-muted)' }}>Récemment</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--vyva-text-muted)', marginTop: '2px' }}>
                      Match à {m.compatibilityScore}% • Cliquez pour discuter
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Chat Conversation View */
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--vyva-card)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setSelectedMatch(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <ArrowLeft size={22} />
              </button>
              <img
                src={selectedMatch.avatarUrl}
                alt={selectedMatch.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>{selectedMatch.name}</div>
                <div style={{ fontSize: '11px', color: '#10B981' }}>En ligne</div>
              </div>
            </div>

            <button
              onClick={() => onOpenReport(selectedMatch)}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
            >
              <ShieldAlert size={20} />
            </button>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--vyva-text-muted)', margin: '10px 0' }}>
              Match confirmé le {new Date().toLocaleDateString('fr-FR')} • Échangez en toute sécurité
            </div>

            {(chatHistory[selectedMatch.id] || [
              { id: 1, sender: 'PARTNER', text: `Coucou ! Ravis de notre rencontre vidéo VYVA ! 😊`, time: '12:34' }
            ]).map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'ME' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'ME' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.sender === 'ME' ? 'var(--vyva-gradient-primary)' : 'var(--vyva-card)',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <div>{msg.text}</div>
                <div style={{ fontSize: '10px', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>{msg.time}</div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '12px 16px',
            background: 'var(--vyva-card)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <input
              type="text"
              placeholder="Écrire un message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#09090B',
                color: '#fff',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--vyva-gradient-primary)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

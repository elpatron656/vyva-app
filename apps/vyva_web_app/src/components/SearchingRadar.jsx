import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, ShieldCheck, Globe, Timer } from 'lucide-react';

export default function SearchingRadar({ onMatchFound, onCancel, gender, mode, selectedCountry, passTimeString }) {
  const [compatibilityScore, setCompatibilityScore] = useState(78);
  const [searchStep, setSearchStep] = useState(`Recherche de profils en ${selectedCountry?.name || 'France'}...`);

  const countryName = selectedCountry?.name || 'France';
  const countryFlag = selectedCountry?.flag || '🇫🇷';
  const countryCode = selectedCountry?.code || 'FR';

  const MP4_SAMPLE_VIDEOS = [
    "https://assets.mixkit.co/videos/preview/mixkit-girl-looking-at-her-phone-and-smiling-40176-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-40177-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-40178-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-at-the-camera-40179-large.mp4"
  ];

  useEffect(() => {
    // Country specific sample pools with live video streams
    const COUNTRY_PROFILES = {
      ES: [
        { name: 'Elena', city: 'Madrid', videoUrl: MP4_SAMPLE_VIDEOS[0] },
        { name: 'Mateo', city: 'Barcelone', videoUrl: MP4_SAMPLE_VIDEOS[3] },
        { name: 'Lucia', city: 'Valence', videoUrl: MP4_SAMPLE_VIDEOS[1] },
        { name: 'Carlos', city: 'Séville', videoUrl: MP4_SAMPLE_VIDEOS[3] }
      ],
      IT: [
        { name: 'Giulia', city: 'Rome', videoUrl: MP4_SAMPLE_VIDEOS[2] },
        { name: 'Marco', city: 'Milan', videoUrl: MP4_SAMPLE_VIDEOS[3] }
      ],
      GB: [
        { name: 'Emily', city: 'Londres', videoUrl: MP4_SAMPLE_VIDEOS[0] },
        { name: 'Oliver', city: 'Manchester', videoUrl: MP4_SAMPLE_VIDEOS[3] }
      ],
      US: [
        { name: 'Jessica', city: 'New York', videoUrl: MP4_SAMPLE_VIDEOS[1] },
        { name: 'Ethan', city: 'Los Angeles', videoUrl: MP4_SAMPLE_VIDEOS[3] }
      ],
      JP: [
        { name: 'Yuki', city: 'Tokyo', videoUrl: MP4_SAMPLE_VIDEOS[2] },
        { name: 'Kenji', city: 'Kyoto', videoUrl: MP4_SAMPLE_VIDEOS[3] }
      ],
      FR: [
        { name: 'Sophie', city: 'Paris', videoUrl: MP4_SAMPLE_VIDEOS[0] },
        { name: 'Camille', city: 'Lyon', videoUrl: MP4_SAMPLE_VIDEOS[1] },
        { name: 'Lucas', city: 'Marseille', videoUrl: MP4_SAMPLE_VIDEOS[3] },
        { name: 'Antoine', city: 'Bordeaux', videoUrl: MP4_SAMPLE_VIDEOS[3] }
      ]
    };

    const pool = COUNTRY_PROFILES[countryCode] || COUNTRY_PROFILES.FR;
    const selectedProfile = pool[Math.floor(Math.random() * pool.length)];

    // Dynamic score ticker during matchmaking
    const scoreInterval = setInterval(() => {
      setCompatibilityScore((prev) => Math.min(98, prev + Math.floor(Math.random() * 4)));
    }, 600);

    const step1 = setTimeout(() => {
      setSearchStep(`Connexion aux serveurs VYVA AI (${countryName})...`);
    }, 1200);

    const step2 = setTimeout(() => {
      setSearchStep("Optimisation du flux vidéo HD...");
    }, 2400);

    const matchTimer = setTimeout(() => {
      onMatchFound({
        id: `user_${Math.random().toString(36).substring(2, 7)}`,
        name: selectedProfile.name,
        age: 21 + Math.floor(Math.random() * 6),
        country: `${countryFlag} ${countryName}`,
        city: selectedProfile.city,
        interests: ['Voyages', 'Musique', 'Cinéma'],
        compatibilityScore: Math.min(96, compatibilityScore + 5),
        videoUrl: selectedProfile.videoUrl
      });
    }, 3800);

    return () => {
      clearInterval(scoreInterval);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(matchTimer);
    };
  }, []);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '40px 24px',
      background: 'radial-gradient(circle at center, #1e0b36 0%, #09090B 100%)'
    }}>
      <div style={{ textAlign: 'center' }}>
        
        {/* Country Travel Pass Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(124, 58, 237, 0.25)',
          border: '1px solid var(--vyva-primary)',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '10px'
        }}>
          <Globe size={15} color="#FF7EB3" />
          <span>Destination : {countryFlag} {countryName}</span>
          {passTimeString && (
            <span style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              • <Timer size={12} /> {passTimeString}
            </span>
          )}
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
          {mode === 'MYSTERY' ? '🎭 MYSTERY MATCH' : 'VYVA MATCH AI'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--vyva-text-muted)' }}>{searchStep}</p>
      </div>

      {/* Pulsing AI Compatibility Badge */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="radar-circle" style={{ width: '240px', height: '240px' }}></div>
        <div className="radar-circle" style={{ width: '240px', height: '240px' }}></div>

        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'var(--vyva-card)',
          border: '3px solid var(--vyva-secondary)',
          boxShadow: 'var(--vyva-shadow-pink)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <Sparkles color="#FF7EB3" size={28} style={{ marginBottom: '6px' }} />
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--vyva-text-muted)' }}>Compatibilité</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>{compatibilityScore}%</div>
        </div>
      </div>

      {/* Safety Badge & Cancel Button */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          fontSize: '11px',
          color: 'var(--vyva-text-muted)',
          marginBottom: '20px'
        }}>
          <ShieldCheck size={14} color="#10B981" /> Environnement sécurisé & Flux Vidéo HD Vérifié
        </div>

        <button
          onClick={onCancel}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '99px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'transparent',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Annuler la recherche
        </button>
      </div>
    </div>
  );
}

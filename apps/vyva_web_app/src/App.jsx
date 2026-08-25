import React, { useState, useEffect } from 'react';
import { Video, MessageSquare, ShoppingBag, User as UserIcon, Monitor, Maximize2, ShieldCheck, Camera, Globe, Timer, Smartphone } from 'lucide-react';
import MatchmakingCenter from './components/MatchmakingCenter';
import SearchingRadar from './components/SearchingRadar';
import VideoCallScreen from './components/VideoCallScreen';
import StoreScreen from './components/StoreScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfileScreen';
import TravelModal from './components/TravelModal';
import PassPaymentModal from './components/PassPaymentModal';
import CameraTestModal from './components/CameraTestModal';
import MobileQrModal from './components/MobileQrModal';
import ReportModal from './components/ReportModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const HOME_COUNTRY = { code: 'FR', name: 'France', flag: '🇫🇷', isHome: true };

  // Navigation & View Modes
  const [currentTab, setCurrentTab] = useState('MATCH'); // 'MATCH', 'CHAT', 'STORE', 'PROFILE'
  const [viewMode, setViewMode] = useState('FRAME'); // 'FRAME', 'FULLSCREEN', 'ADMIN'
  const [appState, setAppState] = useState('IDLE'); // 'IDLE', 'SEARCHING', 'CALL'

  // User State
  const [user, setUser] = useState({
    id: 'usr_me_77',
    displayName: 'Alexandre',
    gender: 'MALE',
    coins: 150,
    isPremium: false,
    premiumTier: 'FREE',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
  });

  // Country Travel & Pass System State
  const [selectedCountry, setSelectedCountry] = useState(HOME_COUNTRY);
  const [activePasses, setActivePasses] = useState({}); // { 'ES': { country, expiresAt } }
  const [payingCountry, setPayingCountry] = useState(null);

  // Active Match Call & History
  const [searchParams, setSearchParams] = useState({ gender: 'EVERYONE', mode: 'STANDARD' });
  const [currentPartner, setCurrentPartner] = useState(null);
  const [matches, setMatches] = useState([
    {
      id: 'match_1',
      name: 'Elena',
      age: 23,
      country: '🇪🇸 Espagne',
      city: 'Madrid',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      compatibilityScore: 92
    }
  ]);

  // Modals state
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showCameraTestModal, setShowCameraTestModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [reportingPartner, setReportingPartner] = useState(null);

  // 1-second Interval Ticker for 30-Minute Pass Expiration
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      let updatedPasses = null;

      Object.keys(activePasses).forEach((code) => {
        const pass = activePasses[code];
        if (pass && pass.expiresAt <= now) {
          if (!updatedPasses) updatedPasses = { ...activePasses };
          delete updatedPasses[code];

          // If currently selected country expired, revert to France
          if (selectedCountry.code === code) {
            setSelectedCountry(HOME_COUNTRY);
            alert(`⌛ Votre Pass 30 minutes pour ${pass.country.name} est expiré. Retour automatique en France !`);
          }
        }
      });

      if (updatedPasses) {
        setActivePasses(updatedPasses);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activePasses, selectedCountry]);

  // Handlers for Pass Purchase & Travel
  const handleOpenPassPayment = (country) => {
    setShowTravelModal(false);
    setPayingCountry(country);
  };

  const handlePassActivated = (country, durationMinutes, coinsSpent = 0) => {
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;
    
    if (coinsSpent > 0) {
      setUser((u) => ({ ...u, coins: Math.max(0, u.coins - coinsSpent) }));
    }

    setActivePasses((prev) => ({
      ...prev,
      [country.code]: { country, expiresAt, durationMinutes }
    }));

    setSelectedCountry(country);
    setPayingCountry(null);
  };

  const handleSelectFreeCountry = (country) => {
    setSelectedCountry(country);
  };

  // Matchmaking Handlers
  const handleStartSearch = (gender, mode) => {
    // Verify if pass is required and valid for selected foreign country
    if (selectedCountry.code !== 'FR') {
      const pass = activePasses[selectedCountry.code];
      if (!pass || pass.expiresAt <= Date.now()) {
        alert(`⚠️ Votre Pass 30 min pour ${selectedCountry.name} n'est pas actif ! Veuillez débloquer le pass à 0,99 €.`);
        setPayingCountry(selectedCountry);
        return;
      }
    }

    setSearchParams({ gender, mode });
    setAppState('SEARCHING');
  };

  const handleMatchFound = (partner) => {
    setCurrentPartner(partner);
    setAppState('CALL');
  };

  const handleMatchSuccess = (partner) => {
    if (!matches.some((m) => m.id === partner.id)) {
      setMatches((prev) => [partner, ...prev]);
    }
  };

  const handleNextMatch = () => {
    setAppState('SEARCHING');
  };

  const handleAddCoins = (amount) => {
    setUser((u) => ({ ...u, coins: u.coins + amount }));
  };

  const handleUpgradeSubscription = (tier) => {
    setUser((u) => ({
      ...u,
      isPremium: true,
      premiumTier: tier,
      coins: u.coins + (tier === 'GOLD' ? 600 : 200)
    }));
    alert(`🎉 FÉLICITATIONS ! Vous êtes maintenant abonnée à VYVA ${tier} !`);
    setCurrentTab('MATCH');
  };

  // Helper for active pass countdown string
  const activePass = activePasses[selectedCountry.code];
  const passTimeString = activePass && activePass.expiresAt > Date.now()
    ? (() => {
        const rem = Math.max(0, Math.floor((activePass.expiresAt - Date.now()) / 1000));
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      })()
    : null;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#030304',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      
      {/* Top Demo Toolbar */}
      <div className="demo-top-toolbar" style={{
        position: 'fixed',
        top: '16px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(24, 24, 27, 0.92)',
        backdropFilter: 'blur(20px)',
        padding: '8px 16px',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
      }}>
        {/* Frame / Fullscreen Switch */}
        <button
          onClick={() => setViewMode(viewMode === 'FRAME' ? 'FULLSCREEN' : 'FRAME')}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {viewMode === 'FRAME' ? <Maximize2 size={14} color="#FF7EB3" /> : <Monitor size={14} color="#FF7EB3" />}
          <span>{viewMode === 'FRAME' ? 'Plein Écran' : 'Simulateur'}</span>
        </button>

        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

        {/* Mobile QR Code Button */}
        <button
          onClick={() => setShowQrModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#10B981',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Smartphone size={14} color="#10B981" />
          <span>Tester sur Téléphone 📲</span>
        </button>

        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

        {/* USB Camera Test Button */}
        <button
          onClick={() => setShowCameraTestModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FF7EB3',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Camera size={14} color="#FF7EB3" />
          <span>Test Caméra 📷</span>
        </button>

        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

        {/* Admin Dashboard Switch */}
        <button
          onClick={() => setViewMode(viewMode === 'ADMIN' ? 'FRAME' : 'ADMIN')}
          style={{
            background: 'none',
            border: 'none',
            color: viewMode === 'ADMIN' ? 'var(--vyva-secondary)' : '#fff',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={14} color="#7C3AED" />
          <span>Admin</span>
        </button>
      </div>

      {/* Main View Container */}
      {viewMode === 'ADMIN' ? (
        <div style={{ width: '100%', height: '100%', paddingTop: '60px' }}>
          <AdminDashboard onExitAdmin={() => setViewMode('FRAME')} />
        </div>
      ) : (
        <div className={`app-viewport-container ${viewMode === 'FULLSCREEN' ? 'fullscreen' : ''}`}>
          
          {/* Mobile Notch */}
          {viewMode === 'FRAME' && <div className="mobile-notch"></div>}

          {/* Status Bar */}
          <div className="mobile-header-bar">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>22:45</span>
              {passTimeString && (
                <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '2px 6px', borderRadius: '10px', fontWeight: '800' }}>
                  ⏱️ {selectedCountry.flag} {passTimeString}
                </span>
              )}
            </span>
            <div style={{ display: 'flex', gap: '6px', fontSize: '11px', opacity: 0.8 }}>
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Screen Content Router */}
          <div className="vyva-screen-content">
            {appState === 'SEARCHING' ? (
              <SearchingRadar
                gender={searchParams.gender}
                mode={searchParams.mode}
                selectedCountry={selectedCountry}
                passTimeString={passTimeString}
                onMatchFound={handleMatchFound}
                onCancel={() => setAppState('IDLE')}
              />
            ) : appState === 'CALL' && currentPartner ? (
              <VideoCallScreen
                partner={currentPartner}
                mode={searchParams.mode}
                onNextMatch={handleNextMatch}
                onMatchSuccess={handleMatchSuccess}
                onOpenReport={(p) => setReportingPartner(p)}
                onOpenCameraTest={() => setShowCameraTestModal(true)}
              />
            ) : (
              <>
                {currentTab === 'MATCH' && (
                  <MatchmakingCenter
                    user={user}
                    selectedCountry={selectedCountry}
                    activePasses={activePasses}
                    onStartSearch={handleStartSearch}
                    onOpenStore={() => setCurrentTab('STORE')}
                    onOpenTravel={() => setShowTravelModal(true)}
                    onOpenCameraTest={() => setShowCameraTestModal(true)}
                    onOpenPassPayment={handleOpenPassPayment}
                  />
                )}
                {currentTab === 'CHAT' && (
                  <ChatScreen
                    matches={matches}
                    onOpenReport={(p) => setReportingPartner(p)}
                  />
                )}
                {currentTab === 'STORE' && (
                  <StoreScreen
                    user={user}
                    onAddCoins={handleAddCoins}
                    onUpgradeSubscription={handleUpgradeSubscription}
                  />
                )}
                {currentTab === 'PROFILE' && (
                  <ProfileScreen
                    user={user}
                    onOpenStore={() => setCurrentTab('STORE')}
                  />
                )}
              </>
            )}

            {/* Travel Selector Modal */}
            {showTravelModal && (
              <TravelModal
                activePasses={activePasses}
                selectedCountry={selectedCountry}
                homeCountry={HOME_COUNTRY}
                onSelectFreeCountry={handleSelectFreeCountry}
                onOpenPassPayment={handleOpenPassPayment}
                onClose={() => setShowTravelModal(false)}
              />
            )}

            {/* 30-Minute Pass Payment Modal (0,99€) */}
            {payingCountry && (
              <PassPaymentModal
                country={payingCountry}
                user={user}
                onPassActivated={handlePassActivated}
                onClose={() => setPayingCountry(null)}
                onOpenStore={() => {
                  setPayingCountry(null);
                  setCurrentTab('STORE');
                }}
              />
            )}

            {/* USB Camera Test & Preview Modal */}
            {showCameraTestModal && (
              <CameraTestModal
                onClose={() => setShowCameraTestModal(false)}
              />
            )}

            {/* Mobile Scan QR Code Modal */}
            {showQrModal && (
              <MobileQrModal
                onClose={() => setShowQrModal(false)}
              />
            )}

            {/* Report & Block Modal */}
            {reportingPartner && (
              <ReportModal
                reportedUser={reportingPartner}
                onClose={() => setReportingPartner(null)}
                onSubmitReport={(rep) => {
                  console.log("Report submitted:", rep);
                  setAppState('IDLE');
                }}
              />
            )}
          </div>

          {/* Bottom Navigation Bar */}
          {appState === 'IDLE' && (
            <div className="vyva-bottom-nav">
              <button
                className={`nav-item ${currentTab === 'MATCH' ? 'active' : ''}`}
                onClick={() => setCurrentTab('MATCH')}
              >
                <Video size={22} />
                <span>Match</span>
              </button>

              <button
                className={`nav-item ${currentTab === 'CHAT' ? 'active' : ''}`}
                onClick={() => setCurrentTab('CHAT')}
              >
                <MessageSquare size={22} />
                <span>Chat</span>
              </button>

              <button
                className={`nav-item ${currentTab === 'STORE' ? 'active' : ''}`}
                onClick={() => setCurrentTab('STORE')}
              >
                <ShoppingBag size={22} />
                <span>Boutique</span>
              </button>

              <button
                className={`nav-item ${currentTab === 'PROFILE' ? 'active' : ''}`}
                onClick={() => setCurrentTab('PROFILE')}
              >
                <UserIcon size={22} />
                <span>Profil</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

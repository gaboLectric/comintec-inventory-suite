import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styled from '@emotion/styled';
import { X, Camera, AlertCircle, CheckCircle, Zap, ZapOff, ZoomIn, ZoomOut, History, Star, StarOff } from 'lucide-react';
import { GlassCard } from './GlassCard';

/**
 * QRScannerFullscreen Component
 * 
 * A modern, full-screen QR scanner with glassmorphism design.
 * Features:
 * - Full-screen immersive experience
 * - Glass morphism UI elements
 * - Animated scanning frame
 * - Visual and haptic feedback
 * - Mobile-optimized controls
 * - Flashlight support
 * - Auto-initialization
 */

const FullscreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(var(--glass-blur-strong));
  -webkit-backdrop-filter: blur(var(--glass-blur-strong));
  
  display: flex;
  flex-direction: column;
  
  /* Smooth entrance animation */
  animation: fadeIn var(--transition-normal) ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(var(--glass-blur-strong));
      -webkit-backdrop-filter: blur(var(--glass-blur-strong));
    }
  }
`;

const TopControls = styled(GlassCard)`
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  right: var(--space-4);
  z-index: 10;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  padding: var(--space-3) var(--space-4);
  
  @media (max-width: var(--breakpoint-mobile)) {
    top: var(--space-3);
    left: var(--space-3);
    right: var(--space-3);
  }
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  
  color: var(--font-color-primary);
  cursor: pointer;
  
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--glass-bg-strong);
    border-color: var(--glass-border-hover);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Larger touch targets on mobile */
  @media (max-width: var(--breakpoint-mobile)) {
    width: 48px;
    height: 48px;
  }
`;

const ScannerArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--space-8) var(--space-4);
  
  @media (max-width: var(--breakpoint-mobile)) {
    padding: var(--space-6) var(--space-3);
  }
`;

const ScannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  
  #reader {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    border-radius: 20px !important;
    overflow: hidden !important;
  }
  
  #reader__scan_region {
    background: transparent !important;
  }
  
  #reader__dashboard {
    display: none !important;
  }
  
  /* Hide default UI elements */
  #reader__camera_selection,
  #reader__camera_permission_button {
    display: none !important;
  }
`;

const ScanningFrame = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  
  border: 2px solid var(--accent-blue);
  border-radius: 20px;
  
  pointer-events: none;
  z-index: 5;
  
  /* Animated corners */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border: 3px solid var(--accent-blue);
    border-radius: 8px;
  }
  
  &::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  
  &::after {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  
  /* Scanning animation */
  animation: ${props => props.$isScanning ? 'pulse 2s ease-in-out infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
    }
    50% {
      border-color: var(--accent-green);
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
  }
  
  @media (max-width: var(--breakpoint-mobile)) {
    width: 220px;
    height: 220px;
  }
`;

const StatusOverlay = styled(GlassCard)`
  position: absolute;
  bottom: var(--space-6);
  left: var(--space-4);
  right: var(--space-4);
  z-index: 10;
  
  text-align: center;
  
  @media (max-width: var(--breakpoint-mobile)) {
    bottom: var(--space-4);
    left: var(--space-3);
    right: var(--space-3);
  }
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  
  ${props => props.$type === 'error' && `
    color: var(--accent-red);
  `}
  
  ${props => props.$type === 'success' && `
    color: var(--accent-green);
  `}
  
  ${props => props.$type === 'scanning' && `
    color: var(--accent-blue);
  `}
  
  ${props => props.$type === 'loading' && `
    color: var(--font-color-secondary);
  `}
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid var(--glass-border);
  border-top: 2px solid var(--accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessAnimation = styled.div`
  animation: successPulse 0.6s ease-out;
  
  @keyframes successPulse {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const BottomControls = styled.div`
  position: absolute;
  bottom: calc(var(--space-6) + 80px);
  left: var(--space-4);
  right: var(--space-4);
  z-index: 10;
  
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  
  @media (max-width: 768px) {
    bottom: calc(var(--space-4) + 80px);
    left: var(--space-3);
    right: var(--space-3);
  }
`;

const ZoomControls = styled(GlassCard)`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
`;

const ZoomLevel = styled.span`
  font-size: var(--font-size-sm);
  color: var(--font-color-secondary);
  min-width: 40px;
  text-align: center;
`;

const HistoryPanel = styled(GlassCard)`
  position: absolute;
  top: 70px;
  right: var(--space-4);
  width: 280px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 15;
  
  @media (max-width: 768px) {
    right: var(--space-3);
    width: calc(100% - var(--space-6));
    max-width: 300px;
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: var(--space-2);
`;

const HistoryTitle = styled.span`
  font-weight: var(--font-weight-medium);
  color: var(--font-color-primary);
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--glass-bg-light);
  }
`;

const HistoryItemText = styled.span`
  font-size: var(--font-size-sm);
  color: var(--font-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  padding: var(--space-1);
  cursor: pointer;
  color: ${props => props.$isFavorite ? 'var(--accent-yellow)' : 'var(--font-color-tertiary)'};
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--accent-yellow);
  }
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: var(--space-4);
  color: var(--font-color-tertiary);
  font-size: var(--font-size-sm);
`;

// LocalStorage keys
const STORAGE_KEYS = {
  HISTORY: 'qr_scanner_history',
  FAVORITES: 'qr_scanner_favorites'
};

// Helper functions for localStorage
const getStoredHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50))); // Keep last 50
  } catch {
    console.warn('Failed to save scan history');
  }
};

const getStoredFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch {
    console.warn('Failed to save favorites');
  }
};

export const QRScannerFullscreen = ({ 
  isOpen, 
  onClose, 
  onScan, 
  onError,
  enableVibration = true,
  enableSound = false 
}) => {
  const [scannerState, setScannerState] = useState('loading'); // loading, scanning, success, error
  const [error, setError] = useState(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isSecureContextOk, setIsSecureContextOk] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const scannerRef = useRef(null);
  const trackRef = useRef(null);

  // Load history and favorites from localStorage
  useEffect(() => {
    setScanHistory(getStoredHistory());
    setFavorites(getStoredFavorites());
  }, []);

  // Check secure context on mount
  useEffect(() => {
    const hostname = window?.location?.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const ok = Boolean(window?.isSecureContext || isLocalhost);
    setIsSecureContextOk(ok);

    if (!ok) {
      setScannerState('error');
      setError('La cámara solo funciona en HTTPS o localhost. En producción necesitas servir la app por HTTPS.');
    }
  }, []);

  // Vibration feedback
  const vibrate = useCallback((pattern = [100]) => {
    if (enableVibration && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [enableVibration]);

  // Sound feedback (optional)
  const playSound = useCallback((type = 'success') => {
    if (enableSound) {
      // Create a simple beep sound
      const AudioContextClass = window.AudioContext || (window).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = type === 'success' ? 800 : 400;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  }, [enableSound]);

  // Add to history
  const addToHistory = useCallback((id, data) => {
    const newEntry = {
      id,
      data,
      timestamp: Date.now()
    };
    setScanHistory(prev => {
      const updated = [newEntry, ...prev.filter(item => item.id !== id)].slice(0, 50);
      saveHistory(updated);
      return updated;
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter(f => f !== id) : [...prev, id];
      saveFavorites(updated);
      return updated;
    });
    vibrate([50]);
  }, [vibrate]);

  // Select from history
  const selectFromHistory = useCallback((item) => {
    if (onScan) onScan(item.id);
    setShowHistory(false);
    onClose();
  }, [onScan, onClose]);

  // Initialize scanner when opened
  useEffect(() => {
    if (!isOpen || !isSecureContextOk) return;

    setScannerState('loading');
    setError(null);

    const initScanner = async () => {
      try {
        const scanner = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: false, // We'll handle flashlight manually
            showZoomSliderIfSupported: false,
            defaultZoomValueIfSupported: 1
          },
          false
        );
        
        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
        setScannerState('scanning');
        
      } catch (err) {
        console.error('Scanner initialization error:', err);
        setScannerState('error');
        setError('Error al inicializar la cámara');
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initScanner, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      trackRef.current = null;
    };
  }, [isOpen, isSecureContextOk]);

  // Get video track for torch/zoom control
  const getVideoTrack = useCallback(() => {
    if (trackRef.current) return trackRef.current;
    
    const video = document.querySelector('#reader video');
    if (video && video.srcObject) {
      const tracks = video.srcObject.getVideoTracks();
      if (tracks.length > 0) {
        trackRef.current = tracks[0];
        return trackRef.current;
      }
    }
    return null;
  }, []);

  const onScanSuccess = useCallback((decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      
      if (data.type === 'equipment' && data.id) {
        setScannerState('success');
        setError(null);
        
        // Add to history
        addToHistory(data.id, data);
        
        // Provide feedback
        vibrate([100, 50, 100]);
        playSound('success');
        
        // Clean up scanner
        if (scannerRef.current) {
          scannerRef.current.clear().then(() => {
            scannerRef.current = null;
          }).catch(console.error);
        }
        
        // Call success callback after a brief delay to show success state
        setTimeout(() => {
          if (onScan) onScan(data.id);
          onClose();
        }, 1500);
        
      } else {
        throw new Error("Formato de QR inválido");
      }
    } catch (err) {
      console.error("QR Parse Error:", err);
      setScannerState('error');
      setError("El código QR no es válido para este sistema");
      vibrate([200]);
      playSound('error');
      
      if (onError) onError(err);
      
      // Return to scanning after error display
      setTimeout(() => {
        setScannerState('scanning');
        setError(null);
      }, 2000);
    }
  }, [onScan, onClose, onError, vibrate, playSound, addToHistory]);

  const onScanFailure = useCallback((error) => {
    // Ignore continuous scanning errors - they're normal
  }, []);

  // Flashlight toggle (actual torch control)
  const toggleFlashlight = useCallback(async () => {
    try {
      const track = getVideoTrack();
      if (!track) {
        console.warn('No video track available for flashlight');
        return;
      }
      
      const capabilities = track.getCapabilities();
      if (!capabilities.torch) {
        console.warn('Torch not supported on this device');
        return;
      }
      
      const newState = !isFlashlightOn;
      await track.applyConstraints({
        advanced: [{ torch: newState }]
      });
      
      setIsFlashlightOn(newState);
      vibrate([50]);
    } catch (err) {
      console.warn('Flashlight control failed:', err);
    }
  }, [isFlashlightOn, vibrate, getVideoTrack]);

  // Zoom control
  const handleZoom = useCallback(async (direction) => {
    try {
      const track = getVideoTrack();
      if (!track) return;
      
      const capabilities = track.getCapabilities();
      if (!capabilities.zoom) {
        console.warn('Zoom not supported on this device');
        return;
      }
      
      const { min, max, step } = capabilities.zoom;
      const zoomStep = step || 0.5;
      let newZoom = direction === 'in' 
        ? Math.min(zoomLevel + zoomStep, max)
        : Math.max(zoomLevel - zoomStep, min);
      
      await track.applyConstraints({
        advanced: [{ zoom: newZoom }]
      });
      
      setZoomLevel(newZoom);
      vibrate([30]);
    } catch (err) {
      console.warn('Zoom control failed:', err);
    }
  }, [zoomLevel, vibrate, getVideoTrack]);

  // Handle close
  const handleClose = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    trackRef.current = null;
    setShowHistory(false);
    onClose();
  }, [onClose]);

  // Toggle history panel
  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
    vibrate([30]);
  }, [vibrate]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const renderStatusMessage = () => {
    switch (scannerState) {
      case 'loading':
        return (
          <StatusMessage $type="loading">
            <LoadingSpinner />
            Inicializando cámara...
          </StatusMessage>
        );
      case 'scanning':
        return (
          <StatusMessage $type="scanning">
            <Camera size={20} />
            Apunta al código QR para escanearlo
          </StatusMessage>
        );
      case 'success':
        return (
          <SuccessAnimation>
            <StatusMessage $type="success">
              <CheckCircle size={20} />
              ¡Código escaneado correctamente!
            </StatusMessage>
          </SuccessAnimation>
        );
      case 'error':
        return (
          <StatusMessage $type="error">
            <AlertCircle size={20} />
            {error || 'Error al escanear'}
          </StatusMessage>
        );
      default:
        return null;
    }
  };

  return (
    <FullscreenContainer>
      <TopControls variant="medium">
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <ControlButton 
            onClick={toggleFlashlight}
            disabled={scannerState !== 'scanning'}
            title={isFlashlightOn ? "Apagar linterna" : "Encender linterna"}
          >
            {isFlashlightOn ? <Zap size={20} /> : <ZapOff size={20} />}
          </ControlButton>
          <ControlButton 
            onClick={toggleHistory}
            title="Historial de escaneos"
          >
            <History size={20} />
          </ControlButton>
        </div>
        
        <div style={{ 
          color: 'var(--font-color-primary)', 
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--font-size-lg)'
        }}>
          Escáner QR
        </div>
        
        <ControlButton onClick={handleClose} title="Cerrar escáner">
          <X size={20} />
        </ControlButton>
      </TopControls>

      {showHistory && (
        <HistoryPanel variant="medium">
          <HistoryHeader>
            <HistoryTitle>Historial</HistoryTitle>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--font-color-tertiary)' }}>
              {scanHistory.length} escaneos
            </span>
          </HistoryHeader>
          {scanHistory.length === 0 ? (
            <EmptyHistory>No hay escaneos recientes</EmptyHistory>
          ) : (
            scanHistory.map((item) => (
              <HistoryItem key={item.id + item.timestamp} onClick={() => selectFromHistory(item)}>
                <HistoryItemText title={item.id}>
                  {favorites.includes(item.id) && <Star size={12} style={{ marginRight: '4px', color: 'var(--accent-yellow)' }} />}
                  {item.id}
                </HistoryItemText>
                <FavoriteButton 
                  $isFavorite={favorites.includes(item.id)}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                  title={favorites.includes(item.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  {favorites.includes(item.id) ? <Star size={16} /> : <StarOff size={16} />}
                </FavoriteButton>
              </HistoryItem>
            ))
          )}
        </HistoryPanel>
      )}

      <ScannerArea>
        <ScannerContainer>
          <div id="reader"></div>
          {scannerState === 'scanning' && (
            <ScanningFrame $isScanning={true} />
          )}
        </ScannerContainer>
      </ScannerArea>

      <BottomControls>
        <ZoomControls variant="light">
          <ControlButton 
            onClick={() => handleZoom('out')}
            disabled={scannerState !== 'scanning'}
            title="Alejar"
            style={{ width: '36px', height: '36px' }}
          >
            <ZoomOut size={18} />
          </ControlButton>
          <ZoomLevel>{zoomLevel.toFixed(1)}x</ZoomLevel>
          <ControlButton 
            onClick={() => handleZoom('in')}
            disabled={scannerState !== 'scanning'}
            title="Acercar"
            style={{ width: '36px', height: '36px' }}
          >
            <ZoomIn size={18} />
          </ControlButton>
        </ZoomControls>
      </BottomControls>

      <StatusOverlay variant="medium">
        {renderStatusMessage()}
      </StatusOverlay>
    </FullscreenContainer>
  );
};
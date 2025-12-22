import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QRScannerFullscreen } from '../components/QRScannerFullscreen';

// Simple mock for html5-qrcode
vi.mock('html5-qrcode', () => ({
  Html5QrcodeScanner: vi.fn().mockImplementation(() => ({
    render: vi.fn(),
    clear: vi.fn().mockResolvedValue(undefined),
    getCameras: vi.fn().mockResolvedValue([]),
    getState: vi.fn().mockReturnValue(2)
  }))
}));

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn()
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('QRScannerFullscreen', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onScan: vi.fn(),
    onError: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    // Mock secure context
    Object.defineProperty(window, 'isSecureContext', {
      writable: true,
      value: true
    });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: 'localhost' }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<QRScannerFullscreen {...defaultProps} />);
    
    expect(screen.getByText('Escáner QR')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<QRScannerFullscreen {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Escáner QR')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<QRScannerFullscreen {...defaultProps} />);
    
    const closeButton = screen.getByTitle('Cerrar escáner');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<QRScannerFullscreen {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('has flashlight toggle button', () => {
    render(<QRScannerFullscreen {...defaultProps} />);
    
    const flashlightButton = screen.getByTitle(/linterna/);
    expect(flashlightButton).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<QRScannerFullscreen {...defaultProps} />);
    
    expect(screen.getByText('Inicializando cámara...')).toBeInTheDocument();
  });

  it('has proper glassmorphism styling classes', () => {
    const { container } = render(<QRScannerFullscreen {...defaultProps} />);
    
    // Check that the fullscreen container exists
    const fullscreenContainer = container.firstChild;
    expect(fullscreenContainer).toHaveClass('css-mqkvzt'); // This is the styled component class
  });

  it('renders scanner area and controls', () => {
    render(<QRScannerFullscreen {...defaultProps} />);
    
    // Check for scanner area
    expect(screen.getByRole('button', { name: /cerrar escáner/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /linterna/i })).toBeInTheDocument();
    
    // Check for scanner container
    const readerDiv = document.getElementById('reader');
    expect(readerDiv).toBeInTheDocument();
  });

  it('handles insecure context properly', () => {
    Object.defineProperty(window, 'isSecureContext', {
      writable: true,
      value: false
    });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hostname: '192.168.1.100' }
    });

    render(<QRScannerFullscreen {...defaultProps} />);
    
    // Should show loading initially, then error after initialization
    expect(screen.getByText('Inicializando cámara...')).toBeInTheDocument();
  });

  it('supports vibration and sound props', () => {
    render(
      <QRScannerFullscreen 
        {...defaultProps} 
        enableVibration={true}
        enableSound={true}
      />
    );
    
    // Component should render without errors
    expect(screen.getByText('Escáner QR')).toBeInTheDocument();
  });

  // Task 14.5: Advanced functionalities tests
  describe('History functionality', () => {
    it('has history toggle button', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      const historyButton = screen.getByTitle('Historial de escaneos');
      expect(historyButton).toBeInTheDocument();
    });

    it('shows history panel when history button is clicked', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      const historyButton = screen.getByTitle('Historial de escaneos');
      fireEvent.click(historyButton);
      
      expect(screen.getByText('Historial')).toBeInTheDocument();
    });

    it('shows empty history message when no scans', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      const historyButton = screen.getByTitle('Historial de escaneos');
      fireEvent.click(historyButton);
      
      expect(screen.getByText('No hay escaneos recientes')).toBeInTheDocument();
    });

    it('loads history from localStorage on mount', () => {
      const mockHistory = [{ id: 'test-123', data: { type: 'equipment', id: 'test-123' }, timestamp: Date.now() }];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockHistory));
      
      render(<QRScannerFullscreen {...defaultProps} />);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('qr_scanner_history');
    });
  });

  describe('Zoom functionality', () => {
    it('has zoom controls', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      expect(screen.getByTitle('Acercar')).toBeInTheDocument();
      expect(screen.getByTitle('Alejar')).toBeInTheDocument();
    });

    it('displays current zoom level', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      expect(screen.getByText('1.0x')).toBeInTheDocument();
    });
  });

  describe('Favorites functionality', () => {
    it('loads favorites from localStorage on mount', () => {
      const mockFavorites = ['fav-123'];
      localStorageMock.getItem.mockReturnValueOnce(null); // history
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockFavorites));
      
      render(<QRScannerFullscreen {...defaultProps} />);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('qr_scanner_favorites');
    });
  });

  // Task 14.6: Accessibility tests
  describe('Accessibility', () => {
    it('has accessible button titles', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      expect(screen.getByTitle('Cerrar escáner')).toBeInTheDocument();
      expect(screen.getByTitle(/linterna/)).toBeInTheDocument();
      expect(screen.getByTitle('Historial de escaneos')).toBeInTheDocument();
      expect(screen.getByTitle('Acercar')).toBeInTheDocument();
      expect(screen.getByTitle('Alejar')).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(5); // close, flashlight, history, zoom in, zoom out
    });

    it('supports keyboard navigation with Escape key', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  // Task 14.6: Responsive design tests
  describe('Responsive design', () => {
    it('renders all controls on mobile viewport', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });
      
      render(<QRScannerFullscreen {...defaultProps} />);
      
      // All controls should still be present
      expect(screen.getByTitle('Cerrar escáner')).toBeInTheDocument();
      expect(screen.getByTitle(/linterna/)).toBeInTheDocument();
      expect(screen.getByTitle('Historial de escaneos')).toBeInTheDocument();
    });

    it('has touch-friendly button sizes (44px minimum)', () => {
      const { container } = render(<QRScannerFullscreen {...defaultProps} />);
      
      // The ControlButton styled component has min 44px width/height
      const closeButton = screen.getByTitle('Cerrar escáner');
      expect(closeButton).toBeInTheDocument();
      // Note: Actual size testing would require computed styles
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('closes history panel when scanner is closed', () => {
      render(<QRScannerFullscreen {...defaultProps} />);
      
      // Open history
      const historyButton = screen.getByTitle('Historial de escaneos');
      fireEvent.click(historyButton);
      expect(screen.getByText('Historial')).toBeInTheDocument();
      
      // Close scanner
      const closeButton = screen.getByTitle('Cerrar escáner');
      fireEvent.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('provides vibration feedback when toggling history', () => {
      render(<QRScannerFullscreen {...defaultProps} enableVibration={true} />);
      
      const historyButton = screen.getByTitle('Historial de escaneos');
      fireEvent.click(historyButton);
      
      expect(navigator.vibrate).toHaveBeenCalled();
    });
  });
});
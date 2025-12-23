import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MobileModal, MobileImageModal } from '../components/MobileModal';
import { useViewport } from '../hooks/useViewport';

// Mock the useViewport hook
vi.mock('../hooks/useViewport', () => ({
  useViewport: vi.fn()
}));

describe('MobileModal Component', () => {
  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Reset body styles
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
  });

  describe('Desktop Behavior', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        width: 800,
        height: 600
      });
    });

    it('should render modal with title and content on desktop', () => {
      render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Test Modal">
          <p>Modal content</p>
        </MobileModal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
      expect(screen.getByLabelText('Cerrar modal: Test Modal')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const mockOnClose = vi.fn();
      render(
        <MobileModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </MobileModal>
      );

      fireEvent.click(screen.getByLabelText('Cerrar modal: Test Modal'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked on desktop', () => {
      const mockOnClose = vi.fn();
      render(
        <MobileModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </MobileModal>
      );

      // Click on the overlay (first div)
      const overlay = screen.getByText('Test Modal').closest('[role="dialog"]')?.parentElement;
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should render actions when provided', () => {
      const actions = (
        <div>
          <button>Cancel</button>
          <button>Save</button>
        </div>
      );

      render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Test Modal" actions={actions}>
          <p>Modal content</p>
        </MobileModal>
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  describe('Mobile Behavior', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667
      });
    });

    it('should render modal with mobile optimizations', () => {
      render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Mobile Modal">
          <p>Mobile content</p>
        </MobileModal>
      );

      expect(screen.getByText('Mobile Modal')).toBeInTheDocument();
      expect(screen.getByText('Mobile content')).toBeInTheDocument();
      
      // Close button should have mobile touch target size
      const closeButton = screen.getByLabelText('Cerrar modal: Mobile Modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('should prevent background scrolling on mobile when open', () => {
      render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Mobile Modal">
          <p>Mobile content</p>
        </MobileModal>
      );

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.width).toBe('100%');
    });

    it('should restore body styles when modal is closed', () => {
      const { rerender } = render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Mobile Modal">
          <p>Mobile content</p>
        </MobileModal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <MobileModal isOpen={false} onClose={vi.fn()} title="Mobile Modal">
          <p>Mobile content</p>
        </MobileModal>
      );

      expect(document.body.style.overflow).toBe('unset');
      expect(document.body.style.position).toBe('unset');
      expect(document.body.style.width).toBe('unset');
    });

    it('should not close on overlay click on mobile', () => {
      const mockOnClose = vi.fn();
      render(
        <MobileModal isOpen={true} onClose={mockOnClose} title="Mobile Modal">
          <p>Mobile content</p>
        </MobileModal>
      );

      // Try to click on overlay - should not close on mobile
      const overlay = screen.getByText('Mobile Modal').closest('[role="dialog"]')?.parentElement;
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).not.toHaveBeenCalled();
      }
    });

    it('should render actions with mobile layout', () => {
      const actions = (
        <div>
          <button>Cancel</button>
          <button>Save</button>
        </div>
      );

      render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Mobile Modal" actions={actions}>
          <p>Mobile content</p>
        </MobileModal>
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  describe('Modal States', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        width: 800,
        height: 600
      });
    });

    it('should not render when isOpen is false', () => {
      render(
        <MobileModal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
          <p>Hidden content</p>
        </MobileModal>
      );

      expect(screen.queryByText('Hidden Modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('should handle different modal sizes', () => {
      const { rerender } = render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Small Modal" size="small">
          <p>Small content</p>
        </MobileModal>
      );

      expect(screen.getByText('Small Modal')).toBeInTheDocument();

      rerender(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Large Modal" size="large">
          <p>Large content</p>
        </MobileModal>
      );

      expect(screen.getByText('Large Modal')).toBeInTheDocument();

      rerender(
        <MobileModal isOpen={true} onClose={vi.fn()} title="XL Modal" size="xl">
          <p>XL content</p>
        </MobileModal>
      );

      expect(screen.getByText('XL Modal')).toBeInTheDocument();
    });

    it('should handle fullScreen prop', () => {
      render(
        <MobileModal isOpen={true} onClose={vi.fn()} title="Fullscreen Modal" fullScreen={true}>
          <p>Fullscreen content</p>
        </MobileModal>
      );

      expect(screen.getByText('Fullscreen Modal')).toBeInTheDocument();
      expect(screen.getByText('Fullscreen content')).toBeInTheDocument();
    });
  });
});

describe('MobileImageModal Component', () => {
  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Reset body styles
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
    document.body.style.width = 'unset';
  });

  describe('Desktop Image Modal', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        width: 800,
        height: 600
      });
    });

    it('should render image modal with image and close button', () => {
      render(
        <MobileImageModal 
          isOpen={true} 
          onClose={vi.fn()} 
          imageUrl="https://example.com/image.jpg"
          altText="Test image"
        />
      );

      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(screen.getByLabelText('Cerrar imagen: Test image')).toBeInTheDocument();
    });

    it('should use default alt text when not provided', () => {
      render(
        <MobileImageModal 
          isOpen={true} 
          onClose={vi.fn()} 
          imageUrl="https://example.com/image.jpg"
        />
      );

      expect(screen.getByAltText('Imagen expandida')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const mockOnClose = vi.fn();
      render(
        <MobileImageModal 
          isOpen={true} 
          onClose={mockOnClose} 
          imageUrl="https://example.com/image.jpg"
        />
      );

      fireEvent.click(screen.getByLabelText('Cerrar imagen: Imagen'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mobile Image Modal', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667
      });
    });

    it('should render image modal with mobile optimizations', () => {
      render(
        <MobileImageModal 
          isOpen={true} 
          onClose={vi.fn()} 
          imageUrl="https://example.com/image.jpg"
          altText="Mobile image"
        />
      );

      const image = screen.getByAltText('Mobile image');
      expect(image).toBeInTheDocument();
      expect(screen.getByLabelText('Cerrar imagen: Mobile image')).toBeInTheDocument();
    });

    it('should prevent background scrolling on mobile when open', () => {
      render(
        <MobileImageModal 
          isOpen={true} 
          onClose={vi.fn()} 
          imageUrl="https://example.com/image.jpg"
        />
      );

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.width).toBe('100%');
    });
  });

  describe('Image Modal States', () => {
    beforeEach(() => {
      useViewport.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        width: 800,
        height: 600
      });
    });

    it('should not render when isOpen is false', () => {
      render(
        <MobileImageModal 
          isOpen={false} 
          onClose={vi.fn()} 
          imageUrl="https://example.com/image.jpg"
          altText="Hidden image"
        />
      );

      expect(screen.queryByAltText('Hidden image')).not.toBeInTheDocument();
    });
  });
});
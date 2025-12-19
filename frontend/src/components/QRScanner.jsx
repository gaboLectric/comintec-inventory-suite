import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styled from '@emotion/styled';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

const ScannerContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
`;

const ScannerBox = styled.div`
  margin-top: var(--space-4);
  border-radius: var(--radius-md);
  overflow: hidden;
  
  #reader {
    width: 100%;
    border: none !important;
  }
  
  #reader__scan_region {
    background: white;
  }
`;

const StatusMessage = styled.div`
  margin-top: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  ${props => props.type === 'error' && `
    background: var(--brand-red-2);
    color: var(--brand-red-9);
    border: 1px solid var(--brand-red-4);
  `}
  
  ${props => props.type === 'success' && `
    background: var(--brand-green-2);
    color: var(--brand-green-9);
    border: 1px solid var(--brand-green-4);
  `}
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
  color: var(--font-color-primary);
  cursor: pointer;
  margin: 0 auto;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary);
  }
`;

export const QRScanner = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [error, setError] = useState(null);
  const [isSecureContextOk, setIsSecureContextOk] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Camera access requires a secure context (HTTPS) or localhost.
    // When the app is served over plain HTTP on an IP (typical LAN), browsers block getUserMedia.
    const hostname = window?.location?.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const ok = Boolean(window?.isSecureContext || isLocalhost);
    setIsSecureContextOk(ok);

    if (!ok) {
      setIsScanning(false);
      setLastScanned(null);
      setError('La cámara solo funciona en HTTPS o localhost. En producción necesitas servir la app por HTTPS.');
    }
  }, []);

  useEffect(() => {
    if (!isSecureContextOk) return;

    if (isScanning && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      );
      
      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning, isSecureContextOk]);

  const onScanSuccess = (decodedText, decodedResult) => {
    try {
      const data = JSON.parse(decodedText);
      
      if (data.type === 'equipment' && data.id) {
        setLastScanned(data.id);
        setError(null);
        
        // Stop scanning after successful scan
        if (scannerRef.current) {
          scannerRef.current.clear().then(() => {
            scannerRef.current = null;
            setIsScanning(false);
          }).catch(console.error);
        }
        
        if (onScan) onScan(data.id);
      } else {
        throw new Error("Formato de QR inválido");
      }
    } catch (err) {
      console.error("QR Parse Error:", err);
      setError("El código QR no es válido para este sistema");
      if (onError) onError(err);
    }
  };

  const onScanFailure = (error) => {
    // Ignore continuous scanning errors
    // console.warn(`Code scan error = ${error}`);
  };

  const toggleScanner = () => {
    if (!isSecureContextOk) {
      setError('La cámara solo funciona en HTTPS o localhost. En producción necesitas servir la app por HTTPS.');
      return;
    }

    if (isScanning) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      setIsScanning(false);
    } else {
      setLastScanned(null);
      setError(null);
      setIsScanning(true);
    }
  };

  return (
    <ScannerContainer>
      <ToggleButton onClick={toggleScanner} type="button" disabled={!isSecureContextOk}>
        {isScanning ? <CameraOff size={18} /> : <Camera size={18} />}
        {isScanning ? "Detener Escáner" : "Escanear QR"}
      </ToggleButton>

      {isScanning && (
        <ScannerBox>
          <div id="reader"></div>
        </ScannerBox>
      )}

      {error && (
        <StatusMessage type="error">
          <AlertCircle size={16} />
          {error}
        </StatusMessage>
      )}

      {lastScanned && !isScanning && (
        <StatusMessage type="success">
          Código escaneado correctamente
        </StatusMessage>
      )}
    </ScannerContainer>
  );
};

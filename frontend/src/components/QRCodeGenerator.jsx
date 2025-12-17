import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styled from '@emotion/styled';
import { Download } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
`;

const InfoContainer = styled.div`
  text-align: center;
  color: black;
`;

const ProductName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 4px;
`;

const SerialNumber = styled.div`
  font-family: monospace;
  font-size: 0.9rem;
`;

const IdText = styled.div`
  font-size: 0.7rem;
  color: #666;
  margin-top: 4px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--brand-blue-9);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background: var(--brand-blue-10);
  }
`;

export const QRCodeGenerator = ({ equipment, size = 256 }) => {
  const qrData = JSON.stringify({
    type: "equipment",
    id: equipment.id
  });

  const handleDownload = () => {
    const svg = document.getElementById("equipment-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size + 40; // Add padding
      canvas.height = size + 100; // Add space for text
      
      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR
      ctx.drawImage(img, 20, 20);
      
      // Draw Text
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      
      // Product Name
      ctx.font = "bold 16px Arial";
      ctx.fillText(equipment.producto || "Equipo", canvas.width / 2, size + 45);
      
      // Serial Number
      ctx.font = "14px monospace";
      ctx.fillText(equipment.numero_serie || "", canvas.width / 2, size + 65);
      
      // ID
      ctx.fillStyle = "#666";
      ctx.font = "10px Arial";
      ctx.fillText(equipment.id, canvas.width / 2, size + 85);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${equipment.numero_serie || equipment.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Container>
      <QRCodeSVG 
        id="equipment-qr"
        value={qrData} 
        size={size}
        level="H"
        includeMargin={true}
      />
      
      <InfoContainer>
        <ProductName>{equipment.producto}</ProductName>
        <SerialNumber>{equipment.numero_serie}</SerialNumber>
        <IdText>{equipment.id}</IdText>
      </InfoContainer>

      <DownloadButton onClick={handleDownload}>
        <Download size={16} />
        Descargar PNG
      </DownloadButton>
    </Container>
  );
};

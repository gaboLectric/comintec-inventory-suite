import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ImportModal } from '../components/ImportModal';
import { ButtonStyled } from '../components/FormComponents';
import { Package, PackagePlus, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { useToast } from '../components/Toast';
import { exportData } from '../services/importService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-4);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
`;

const ImportCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--brand-blue-9);
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-blue-9);
  margin-bottom: var(--space-2);
`;

const CardTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--font-color-primary);
`;

const CardDescription = styled.p`
  font-size: var(--font-size-md);
  color: var(--font-color-secondary);
  margin: 0;
  line-height: 1.5;
`;

export function BulkImport() {
  const [importType, setImportType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { addToast } = useToast();

  const handleOpenImport = (type) => {
    setImportType(type);
    setIsModalOpen(true);
  };

  const handleExport = async (type) => {
    setIsExporting(true);
    try {
      await exportData(type);
      addToast(`Inventario de ${type === 'equipments' ? 'equipos' : 'insumos'} exportado con éxito`, 'success');
    } catch (error) {
      addToast('Error al exportar inventario', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportComplete = () => {
    addToast(`Importación de ${importType === 'equipments' ? 'equipos' : 'insumos'} completada con éxito`, 'success');
    setIsModalOpen(false);
  };

  return (
    <Container>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>Carga Masiva de Inventario</h1>
        <p style={{ color: 'var(--font-color-secondary)' }}>Selecciona el tipo de inventario que deseas cargar desde un archivo Excel o CSV.</p>
      </div>

      <Grid>
        <ImportCard>
          <IconWrapper>
            <Package size={32} />
          </IconWrapper>
          <CardTitle>Equipos</CardTitle>
          <CardDescription>
            Carga el inventario de equipos (laptops, monitores, etc.) incluyendo números de serie, marcas y modelos.
          </CardDescription>
          <ButtonStyled 
            onClick={() => handleOpenImport('equipments')}
            style={{ marginTop: 'var(--space-4)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Upload size={18} /> Importar Equipos
          </ButtonStyled>
          <ButtonStyled 
            onClick={() => handleExport('equipments')}
            $variant="secondary"
            disabled={isExporting}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={18} /> Exportar Equipos
          </ButtonStyled>
        </ImportCard>

        <ImportCard>
          <IconWrapper>
            <PackagePlus size={32} />
          </IconWrapper>
          <CardTitle>Insumos</CardTitle>
          <CardDescription>
            Carga el inventario de insumos y consumibles, definiendo stock actual y niveles mínimos deseados.
          </CardDescription>
          <ButtonStyled 
            onClick={() => handleOpenImport('supplies')}
            style={{ marginTop: 'var(--space-4)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Upload size={18} /> Importar Insumos
          </ButtonStyled>
          <ButtonStyled 
            onClick={() => handleExport('supplies')}
            $variant="secondary"
            disabled={isExporting}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={18} /> Exportar Insumos
          </ButtonStyled>
        </ImportCard>
      </Grid>

      <div style={{ 
        marginTop: 'var(--space-8)', 
        padding: 'var(--space-6)', 
        background: 'var(--bg-tertiary)', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color-medium)'
      }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)', color: 'var(--font-color-primary)' }}>
          <FileSpreadsheet size={20} /> Consejos para la importación
        </h4>
        <ul style={{ color: 'var(--font-color-secondary)', fontSize: 'var(--font-size-sm)', paddingLeft: 'var(--space-5)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <li>Asegúrate de que la primera fila contenga los nombres de las columnas.</li>
          <li>El sistema intentará reconocer automáticamente las columnas por sus nombres o sinónimos.</li>
          <li>Para equipos, se recomienda incluir: Código, Producto, Marca, Modelo y Número de Serie.</li>
          <li>Para insumos, se requiere: Nombre, Piezas y Stock Deseado.</li>
          <li>Puedes revisar y corregir los datos antes de confirmar la importación final.</li>
        </ul>
      </div>

      {importType && (
        <ImportModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          type={importType} 
          onImportComplete={handleImportComplete} 
        />
      )}
    </Container>
  );
}

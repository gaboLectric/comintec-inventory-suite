import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Modal } from './Modal';
import { ButtonStyled, ButtonGroup } from './FormComponents';
import { Upload, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { parseExcelFile, validateSupplyData, validateEquipmentData, importSupplies, importEquipments, generateTemplate } from '../services/importService';
import { useToast } from './Toast';

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const FileUploadArea = styled.div`
  border: 2px dashed var(--border-color-strong);
  border-radius: var(--radius-md);
  padding: var(--space-8);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-secondary);

  &:hover {
    border-color: #667eea;
    background: var(--bg-tertiary);
  }
`;

const PreviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
  
  th, td {
    padding: var(--space-2);
    border: 1px solid var(--border-color-medium);
    text-align: left;
  }

  th {
    background: var(--bg-tertiary);
    font-weight: var(--font-weight-semibold);
  }

  tr.error {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const ErrorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  
  li {
    color: var(--brand-red-9);
    font-size: var(--font-size-xs);
    margin-bottom: var(--space-1);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: var(--space-4) 0;

  div {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

export function ImportModal({ isOpen, onClose, type, onImportComplete }) {
  const [step, setStep] = useState('upload'); // upload, preview, importing, results
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [validationResults, setValidationResults] = useState({ valid: [], invalid: [] });
  const [importResults, setImportResults] = useState({ success: [], errors: [] });
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      addToast('El archivo excede el tamaño máximo de 10MB', 'error');
      return;
    }

    setFile(selectedFile);
    try {
      const data = await parseExcelFile(selectedFile);
      
      if (data.length > 5000) {
        addToast('El archivo tiene más de 5000 registros. La importación puede tardar.', 'warning');
      }

      setParsedData(data);
      
      const validation = type === 'supplies' 
        ? validateSupplyData(data) 
        : validateEquipmentData(data);
      
      setValidationResults(validation);
      setStep('preview');
    } catch (error) {
      console.error(error);
      addToast('Error al leer el archivo', 'error');
    }
  };

  const handleImport = async () => {
    setStep('importing');
    const total = validationResults.valid.length;
    let processed = 0;
    
    // Process in chunks of 50
    const chunkSize = 50;
    const chunks = [];
    for (let i = 0; i < total; i += chunkSize) {
      chunks.push(validationResults.valid.slice(i, i + chunkSize));
    }

    let allSuccess = [];
    let allErrors = [];

    for (const chunk of chunks) {
      const result = type === 'supplies' 
        ? await importSupplies(chunk)
        : await importEquipments(chunk);
      
      allSuccess = [...allSuccess, ...result.success];
      allErrors = [...allErrors, ...result.errors];
      
      processed += chunk.length;
      setProgress((processed / total) * 100);
    }

    setImportResults({ success: allSuccess, errors: allErrors });
    setStep('results');
  };

  const handleClose = () => {
    if (step === 'importing') return;

    if (step === 'results' && importResults.success.length > 0) {
      onImportComplete();
    }

    setStep('upload');
    setFile(null);
    setParsedData([]);
    setValidationResults({ valid: [], invalid: [] });
    setImportResults({ success: [], errors: [] });
    setProgress(0);
    onClose();
  };

  const renderUploadStep = () => (
    <StepContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Seleccione un archivo Excel (.xlsx, .xls) o CSV (.csv) para importar.</p>
        <ButtonStyled $variant="secondary" onClick={() => generateTemplate(type)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={16} /> Descargar Plantilla
        </ButtonStyled>
      </div>
      
      <FileUploadArea onClick={() => document.getElementById('fileInput').click()}>
        <input 
          id="fileInput" 
          type="file" 
          accept=".xlsx,.xls,.csv" 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        <Upload size={48} color="var(--font-color-tertiary)" />
        <p style={{ marginTop: 16, color: 'var(--font-color-secondary)' }}>
          Haga clic para seleccionar o arrastre un archivo aquí
        </p>
      </FileUploadArea>

      {type === 'equipments' && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--font-color-secondary)' }}>
          <AlertCircle size={16} />
          <span>Nota: Las imágenes deben agregarse manualmente después de la importación.</span>
        </div>
      )}
    </StepContainer>
  );

  const renderPreviewStep = () => (
    <StepContainer>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-green-9)' }}>
          <CheckCircle size={20} />
          <span>{validationResults.valid.length} registros válidos</span>
        </div>
        {validationResults.invalid.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-red-9)' }}>
            <XCircle size={20} />
            <span>{validationResults.invalid.length} registros inválidos</span>
          </div>
        )}
      </div>

      <div style={{ maxHeight: '60vh', overflow: 'auto', border: '1px solid var(--border-color-medium)', borderRadius: 'var(--radius-sm)' }}>
        <PreviewTable>
          <thead>
            <tr>
              <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Fila</th>
              {type === 'supplies' ? (
                <>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Nombre</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Piezas</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Stock</th>
                </>
              ) : (
                <>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Código</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Producto</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Marca</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Modelo</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>No. Serie</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Pedimento</th>
                  <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Observaciones</th>
                </>
              )}
              <th style={{ position: 'sticky', top: 0, zIndex: 10 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {parsedData.slice(0, 100).map((row, i) => {
              // We need to re-process the row to show exactly what will be imported
              // This duplicates logic from validateData but is necessary for accurate preview
              // Ideally we would store the processed data in state
              
              // Quick re-process for display
              const displayRow = { ...row };
              if (type === 'equipments') {
                 // Apply same cleaning logic as service
                 const ALIASES = {
                    numero_serie: ['numero_serie', 'num_serie', 'no_serie', 'n_serie', 'serie', 'serial', 'sn', 's_n', 'numero_de_serie', 'no_serie', 'n_serie', 's/n', 'num_de_serie', 'serial_no', 'serial_number', 'n_series'],
                    producto: ['producto', 'nombre', 'descripcion', 'equipo', 'item', 'desc', 'description', 'product'],
                    codigo: ['codigo', 'clave', 'sku', 'id', 'code', 'part_number', 'p_n'],
                    marca: ['marca', 'brand', 'fabricante', 'manufacturer', 'make'],
                    modelo: ['modelo', 'model', 'version'],
                    pedimento: ['pedimento', 'ped', 'importacion'],
                    observaciones: ['observaciones', 'notas', 'comentarios', 'detalles', 'obs', 'notes', 'comments']
                 };
                 
                 const findVal = (r, f) => {
                    if (r[f] !== undefined) return r[f];
                    const aliases = ALIASES[f] || [];
                    for (const alias of aliases) {
                        if (r[alias] !== undefined) return r[alias];
                    }
                    return undefined;
                 };

                 ['codigo', 'producto', 'marca', 'modelo', 'numero_serie', 'pedimento', 'observaciones'].forEach(field => {
                    let rawValue = findVal(row, field);
                    let value = rawValue ? String(rawValue).trim() : '';
                    const placeholders = ['n/a', 'na', 'no aplica', 'no tiene', 'sin serie', 's/n', 'sn', '-', '--', '.', '?', '0', 'tbd', 'pending', 'pendiente', 'null', 'undefined', 'vacio', 'none', 'sin datos'];
                    if (placeholders.includes(value.toLowerCase())) value = '';
                    if (value === '') displayRow[field] = 'Sin datos';
                    else displayRow[field] = value;
                 });
              }

              const isInvalid = validationResults.invalid.find(inv => inv.row === i + 2);
              return (
                <tr key={i} className={isInvalid ? 'error' : ''}>
                  <td>{i + 2}</td>
                  {type === 'supplies' ? (
                    <>
                      <td>{displayRow.nombre}</td>
                      <td>{displayRow.piezas}</td>
                      <td>{displayRow.stock_deseado}</td>
                    </>
                  ) : (
                    <>
                      <td>{displayRow.codigo}</td>
                      <td>{displayRow.producto}</td>
                      <td>{displayRow.marca}</td>
                      <td>{displayRow.modelo}</td>
                      <td style={{ fontWeight: 'bold' }}>{displayRow.numero_serie}</td>
                      <td>{displayRow.pedimento}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={displayRow.observaciones}>{displayRow.observaciones}</td>
                    </>
                  )}
                  <td>
                    {isInvalid ? (
                      <div style={{ color: 'var(--brand-red-9)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {isInvalid.errors.map((err, idx) => (
                            <span key={idx} style={{ fontSize: '11px', background: 'rgba(255,0,0,0.1)', padding: '2px 4px', borderRadius: '4px' }}>
                                {err}
                            </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--brand-green-9)' }}>Válido</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </PreviewTable>
        {parsedData.length > 100 && (
          <p style={{ textAlign: 'center', color: 'var(--font-color-tertiary)', padding: 8 }}>
            ... y {parsedData.length - 100} registros más
          </p>
        )}
      </div>

      <ButtonGroup>
        <ButtonStyled $variant="secondary" onClick={() => setStep('upload')}>Volver</ButtonStyled>
        <ButtonStyled onClick={handleImport} disabled={validationResults.valid.length === 0}>
          Importar {validationResults.valid.length} Registros
        </ButtonStyled>
      </ButtonGroup>
    </StepContainer>
  );

  const renderImportingStep = () => (
    <StepContainer>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <h3>Importando registros...</h3>
        <ProgressBar progress={progress}>
          <div />
        </ProgressBar>
        <p>{Math.round(progress)}% completado</p>
      </div>
    </StepContainer>
  );

  const renderResultsStep = () => (
    <StepContainer>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <CheckCircle size={48} color="var(--brand-green-9)" style={{ marginBottom: 16 }} />
        <h3>Proceso completado</h3>
        <p>
          Se importaron exitosamente {importResults.success.length} registros.
          {importResults.errors.length > 0 && ` Fallaron ${importResults.errors.length} registros.`}
        </p>
      </div>

      {importResults.errors.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
          <h4 style={{ color: 'var(--brand-red-9)', marginBottom: 8 }}>Errores:</h4>
          <ErrorList>
            {importResults.errors.map((err, i) => (
              <li key={i}>
                <XCircle size={14} />
                <span>
                  {type === 'supplies' ? err.item.nombre : err.item.producto}: {err.error}
                </span>
              </li>
            ))}
          </ErrorList>
        </div>
      )}

      <ButtonGroup>
        <ButtonStyled onClick={handleClose}>Cerrar</ButtonStyled>
      </ButtonGroup>
    </StepContainer>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={`Importar ${type === 'supplies' ? 'Insumos' : 'Equipos'}`}
      size="xl"
    >
      {step === 'upload' && renderUploadStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'importing' && renderImportingStep()}
      {step === 'results' && renderResultsStep()}
    </Modal>
  );
}

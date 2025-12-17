import React, { useState } from 'react';
import styled from '@emotion/styled';
import { QRScanner } from './QRScanner';
import { ConfirmationModal } from './ConfirmationModal';
import { ButtonStyled } from './CommonStyled';
import { Camera, Type } from 'lucide-react';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const FormRowStyled = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: var(--space-4);
`;

export const FormRow = styled(FormRowStyled, {
  shouldForwardProp: (prop) => !['$columns'].includes(prop)
})`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: var(--space-4);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--font-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  padding: var(--space-3);
  background: var(--bg-primary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
  color: var(--font-color-primary);
  font-size: var(--font-size-md);
  font-family: var(--font-family);

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: var(--font-color-tertiary);
  }
`;

export const Select = styled.select`
  padding: var(--space-3);
  background: var(--bg-primary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
  color: var(--font-color-primary);
  font-size: var(--font-size-md);
  font-family: var(--font-family);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  option {
    background: var(--bg-secondary);
    color: var(--font-color-primary);
  }
`;

export const ListBox = styled(Select)`
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  &::-webkit-scrollbar { 
    display: none;  /* Chrome/Safari */
  }
  
  option {
    padding: var(--space-2);
    margin-bottom: 2px;
    border-radius: var(--radius-xs);
    cursor: pointer;
    
    &:checked {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    &:hover {
      background-color: var(--bg-tertiary);
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-2);
`;

export { ButtonStyled };

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-4);
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color-strong);
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: var(--space-2);
  border: none;
  background: ${props => props.active ? 'var(--bg-tertiary)' : 'transparent'};
  color: ${props => props.active ? 'var(--font-color-primary)' : 'var(--font-color-secondary)'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    color: var(--font-color-primary);
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  user-select: none;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  
  &:hover {
    background: var(--bg-secondary);
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

// --- New Components ---

export const EquipmentInputForm = ({ onSubmit, onCancel }) => {
    const [mode, setMode] = useState('manual'); // 'manual' or 'qr'
    const [formData, setFormData] = useState({
        codigo: '',
        producto: '',
        marca: '',
        modelo: '',
        numero_serie: '',
        pedimento: '',
        observaciones: '',
        vendido: false,
        nota: ''
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleScan = (id) => {
        // In input mode, scanning might be used to copy data from an existing equipment
        // For now, we just alert or could implement fetching data
        alert("Escaneo en entrada no implementado para copiar datos. Use modo manual.");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, file });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <ToggleContainer>
                <ToggleButton 
                    type="button" 
                    active={mode === 'manual'} 
                    onClick={() => setMode('manual')}
                >
                    <Type size={16} /> Manual
                </ToggleButton>
                <ToggleButton 
                    type="button" 
                    active={mode === 'qr'} 
                    onClick={() => setMode('qr')}
                >
                    <Camera size={16} /> Escanear (Copia)
                </ToggleButton>
            </ToggleContainer>

            {mode === 'qr' ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <QRScanner onScan={handleScan} />
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--font-color-secondary)' }}>
                        Escanee un equipo existente para copiar sus datos base
                    </p>
                </div>
            ) : (
                <>
                    <FormRow $columns="1fr 1fr">
                        <FormGroup>
                            <Label>Código</Label>
                            <Input name="codigo" value={formData.codigo} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Producto *</Label>
                            <Input name="producto" value={formData.producto} onChange={handleChange} required />
                        </FormGroup>
                    </FormRow>
                    <FormRow $columns="1fr 1fr">
                        <FormGroup>
                            <Label>Marca</Label>
                            <Input name="marca" value={formData.marca} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Modelo</Label>
                            <Input name="modelo" value={formData.modelo} onChange={handleChange} />
                        </FormGroup>
                    </FormRow>
                    <FormRow $columns="1fr 1fr">
                        <FormGroup>
                            <Label>No. Serie *</Label>
                            <Input name="numero_serie" value={formData.numero_serie} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Pedimento</Label>
                            <Input name="pedimento" value={formData.pedimento} onChange={handleChange} />
                        </FormGroup>
                    </FormRow>
                    <FormGroup>
                        <Label>Observaciones (Max 100)</Label>
                        <Input name="observaciones" value={formData.observaciones} onChange={handleChange} maxLength={100} />
                    </FormGroup>
                    
                    <FormRow $columns="1fr 1fr">
                        <FormGroup>
                            <Label>Imagen</Label>
                            <Input type="file" accept="image/*" onChange={handleFileChange} />
                        </FormGroup>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CheckboxContainer>
                                <Checkbox 
                                    type="checkbox" 
                                    name="vendido" 
                                    checked={formData.vendido} 
                                    onChange={handleChange} 
                                />
                                <span style={{ color: 'var(--font-color-primary)' }}>Marcar como Vendido (Azul)</span>
                            </CheckboxContainer>
                        </div>
                    </FormRow>

                    <FormGroup>
                        <Label>Nota de Entrada</Label>
                        <Input name="nota" value={formData.nota} onChange={handleChange} placeholder="Opcional" />
                    </FormGroup>

                    <ButtonGroup>
                        <ButtonStyled type="button" $variant="secondary" onClick={onCancel}>Cancelar</ButtonStyled>
                        <ButtonStyled type="submit">Registrar Entrada</ButtonStyled>
                    </ButtonGroup>
                </>
            )}
        </Form>
    );
};

export const EquipmentForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        codigo: '',
        producto: '',
        marca: '',
        modelo: '',
        numero_serie: '',
        pedimento: '',
        observaciones: '',
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, file);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormRow $columns="1fr 1fr">
                <FormGroup>
                    <Label>Código</Label>
                    <Input name="codigo" value={formData.codigo} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Producto *</Label>
                    <Input name="producto" value={formData.producto} onChange={handleChange} required />
                </FormGroup>
            </FormRow>
            <FormRow $columns="1fr 1fr">
                <FormGroup>
                    <Label>Marca</Label>
                    <Input name="marca" value={formData.marca} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Modelo</Label>
                    <Input name="modelo" value={formData.modelo} onChange={handleChange} />
                </FormGroup>
            </FormRow>
            <FormRow $columns="1fr 1fr">
                <FormGroup>
                    <Label>No. Serie *</Label>
                    <Input name="numero_serie" value={formData.numero_serie} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>Pedimento</Label>
                    <Input name="pedimento" value={formData.pedimento} onChange={handleChange} />
                </FormGroup>
            </FormRow>
            <FormGroup>
                <Label>Observaciones (Max 100)</Label>
                <Input name="observaciones" value={formData.observaciones} onChange={handleChange} maxLength={100} />
            </FormGroup>
            <FormGroup>
                <Label>Imagen</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
            </FormGroup>
            <ButtonGroup>
                <ButtonStyled type="button" $variant="secondary" onClick={onCancel}>Cancelar</ButtonStyled>
                <ButtonStyled type="submit">Guardar</ButtonStyled>
            </ButtonGroup>
        </Form>
    );
};

export const SupplyForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        nombre: '',
        piezas: 0,
        stock_deseado: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label>Nombre *</Label>
                <Input name="nombre" value={formData.nombre} onChange={handleChange} required />
            </FormGroup>
            <FormRow $columns="1fr 1fr">
                <FormGroup>
                    <Label>Piezas *</Label>
                    <Input type="number" name="piezas" value={formData.piezas} onChange={handleChange} required min="0" />
                </FormGroup>
                <FormGroup>
                    <Label>Stock Deseado *</Label>
                    <Input type="number" name="stock_deseado" value={formData.stock_deseado} onChange={handleChange} required min="0" />
                </FormGroup>
            </FormRow>
            <ButtonGroup>
                <ButtonStyled type="button" $variant="secondary" onClick={onCancel}>Cancelar</ButtonStyled>
                <ButtonStyled type="submit">Guardar</ButtonStyled>
            </ButtonGroup>
        </Form>
    );
};

export const EquipmentOutputForm = ({ equipments, onSubmit, onCancel }) => {
    const [mode, setMode] = useState('manual'); // 'manual' or 'qr'
    const [selectedId, setSelectedId] = useState('');
    const [nota, setNota] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Confirmation Modal State
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [pendingScan, setPendingScan] = useState(null);

    // Filter out sold equipments for the dropdown list
    const availableEquipments = equipments.filter(e => !e.vendido);

    const filteredEquipments = availableEquipments.filter(e => 
        e.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.codigo && e.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleScan = (id) => {
        // Check against ALL equipments (including sold ones) to give better feedback
        const equipment = equipments.find(e => e.id === id);
        
        if (equipment) {
            if (equipment.vendido) {
                alert(`El equipo "${equipment.producto}" (${equipment.numero_serie}) ya fue marcado como VENDIDO.`);
            } else {
                // Open confirmation modal instead of window.confirm
                setPendingScan(equipment);
                setConfirmModalOpen(true);
            }
        } else {
            console.log("Scanned ID:", id);
            alert(`Equipo no encontrado en el sistema.\nID Escaneado: ${id}\n\nVerifique que el equipo haya sido registrado en Entradas.`);
        }
    };

    const handleConfirmScan = () => {
        if (pendingScan) {
            onSubmit({ equipment: pendingScan, nota: 'Salida por QR' });
            setConfirmModalOpen(false);
            setPendingScan(null);
        }
    };

    const handleCancelScan = () => {
        if (pendingScan) {
            // If cancelled, just select it but stay in manual mode
            setSelectedId(pendingScan.id);
            setMode('manual');
            setConfirmModalOpen(false);
            setPendingScan(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const equipment = equipments.find(e => e.id === selectedId);
        if (equipment) {
            onSubmit({ equipment, nota });
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <ToggleContainer>
                    <ToggleButton 
                        type="button" 
                        active={mode === 'manual'} 
                        onClick={() => setMode('manual')}
                    >
                        <Type size={16} /> Manual
                    </ToggleButton>
                    <ToggleButton 
                        type="button" 
                        active={mode === 'qr'} 
                        onClick={() => setMode('qr')}
                    >
                        <Camera size={16} /> Escanear QR
                    </ToggleButton>
                </ToggleContainer>

                {mode === 'qr' ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <QRScanner onScan={handleScan} />
                        <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--font-color-secondary)' }}>
                            Escanee el código QR del equipo para registrar su salida
                        </p>
                    </div>
                ) : (
                    <>
                        <FormGroup>
                            <Label>Buscar Equipo</Label>
                            <Input 
                                placeholder="Buscar por nombre, serie, código..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Seleccionar Equipo *</Label>
                            <ListBox value={selectedId} onChange={e => setSelectedId(e.target.value)} required size={6}>
                                <option value="" disabled>Seleccione un equipo</option>
                                {filteredEquipments.map(e => (
                                    <option key={e.id} value={e.id}>
                                        {e.producto} - {e.numero_serie} ({e.marca})
                                    </option>
                                ))}
                            </ListBox>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nota</Label>
                            <Input value={nota} onChange={e => setNota(e.target.value)} />
                        </FormGroup>
                        <ButtonGroup>
                            <ButtonStyled type="button" $variant="secondary" onClick={onCancel}>Cancelar</ButtonStyled>
                            <ButtonStyled type="submit" disabled={!selectedId}>Confirmar Salida</ButtonStyled>
                        </ButtonGroup>
                    </>
                )}
            </Form>

            <ConfirmationModal 
                isOpen={confirmModalOpen}
                onClose={handleCancelScan}
                onConfirm={handleConfirmScan}
                title="Confirmar Salida"
                message={`¿Está seguro de registrar la salida de este equipo?`}
                details={pendingScan ? `${pendingScan.producto} - Serie: ${pendingScan.numero_serie}` : ''}
            />
        </>
    );
};

export const SupplyOutputForm = ({ supplies, onSubmit, onCancel }) => {
    const [selectedId, setSelectedId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [nota, setNota] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSupplies = supplies.filter(s => 
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedSupply = supplies.find(s => s.id === selectedId);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedSupply) {
            onSubmit({ supply: selectedSupply, cantidad: Number(cantidad), nota });
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label>Buscar Insumo</Label>
                <Input 
                    placeholder="Buscar por nombre..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                />
            </FormGroup>
            <FormGroup>
                <Label>Seleccionar Insumo *</Label>
                <ListBox value={selectedId} onChange={e => { setSelectedId(e.target.value); setCantidad(''); }} required size={6}>
                    <option value="" disabled>Seleccione un insumo</option>
                    {filteredSupplies.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.nombre} (Disp: {s.piezas})
                        </option>
                    ))}
                </ListBox>
            </FormGroup>
            {selectedSupply && (
                <FormGroup>
                    <Label>Cantidad a retirar (Max: {selectedSupply.piezas}) *</Label>
                    <Input 
                        type="number" 
                        value={cantidad} 
                        onChange={e => setCantidad(e.target.value)} 
                        min="1" 
                        max={selectedSupply.piezas} 
                        required 
                    />
                </FormGroup>
            )}
            <FormGroup>
                <Label>Nota</Label>
                <Input value={nota} onChange={e => setNota(e.target.value)} />
            </FormGroup>
            <ButtonGroup>
                <ButtonStyled type="button" $variant="secondary" onClick={onCancel}>Cancelar</ButtonStyled>
                <ButtonStyled type="submit" disabled={!selectedId || !cantidad}>Confirmar Salida</ButtonStyled>
            </ButtonGroup>
        </Form>
    );
};

export const Button = styled(ButtonStyled, {
  shouldForwardProp: (prop) => !['$variant'].includes(prop)
})`
  padding: var(--space-3) var(--space-5);
  background: ${props => props.$variant === 'secondary'
        ? '#3e3e3a'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--anim-duration-fast);

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

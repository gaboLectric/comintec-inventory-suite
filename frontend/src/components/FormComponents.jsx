import React, { useState } from 'react';
import styled from '@emotion/styled';

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

export const ButtonStyled = styled.button`
  padding: var(--space-3) var(--space-5);
  background: ${props => props.$variant === 'secondary'
        ? 'var(--bg-tertiary)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.$variant === 'secondary' ? 'var(--font-color-primary)' : 'white'};
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

// --- New Components ---

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
    const [selectedId, setSelectedId] = useState('');
    const [nota, setNota] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEquipments = equipments.filter(e => 
        e.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.codigo && e.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const equipment = equipments.find(e => e.id === selectedId);
        if (equipment) {
            onSubmit({ equipment, nota });
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
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
        </Form>
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

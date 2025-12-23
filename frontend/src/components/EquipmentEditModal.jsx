import React, { useState, useEffect } from 'react';
import { MobileModal } from './MobileModal';
import { Form, FormRow, FormGroup, Label, Input, ButtonStyled } from './FormComponents';
import { updateEquipment } from '../services/api';
import { useToast } from './Toast';

export function EquipmentEditModal({ isOpen, onClose, equipment, onUpdate }) {
    const [formData, setFormData] = useState({
        codigo: '',
        producto: '',
        marca: '',
        modelo: '',
        numero_serie: '',
        pedimento: '',
        observaciones: ''
    });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (equipment) {
            setFormData({
                codigo: equipment.codigo || '',
                producto: equipment.producto || '',
                marca: equipment.marca || '',
                modelo: equipment.modelo || '',
                numero_serie: equipment.numero_serie || '',
                pedimento: equipment.pedimento || '',
                observaciones: equipment.observaciones || ''
            });
        }
    }, [equipment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateEquipment(equipment.id, formData);
            addToast('Equipo actualizado correctamente', 'success');
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            addToast('Error al actualizar equipo', 'error');
        } finally {
            setLoading(false);
        }
    };

    const actions = (
        <>
            <ButtonStyled 
                type="button" 
                onClick={onClose} 
                style={{ background: 'var(--bg-secondary)', color: 'var(--font-color-primary)' }}
            >
                Cancelar
            </ButtonStyled>
            <ButtonStyled 
                type="submit" 
                disabled={loading}
                onClick={handleSubmit}
            >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
            </ButtonStyled>
        </>
    );

    return (
        <MobileModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Editar Equipo"
            actions={actions}
        >
            <Form onSubmit={handleSubmit}>
                <FormRow $columns="1fr 1fr">
                    <FormGroup>
                        <Label>Código</Label>
                        <Input 
                            name="codigo" 
                            value={formData.codigo} 
                            onChange={handleChange} 
                            required 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Producto</Label>
                        <Input 
                            name="producto" 
                            value={formData.producto} 
                            onChange={handleChange} 
                            required 
                        />
                    </FormGroup>
                </FormRow>

                <FormRow $columns="1fr 1fr">
                    <FormGroup>
                        <Label>Marca</Label>
                        <Input 
                            name="marca" 
                            value={formData.marca} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Modelo</Label>
                        <Input 
                            name="modelo" 
                            value={formData.modelo} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                </FormRow>

                <FormRow $columns="1fr 1fr">
                    <FormGroup>
                        <Label>No. Serie</Label>
                        <Input 
                            name="numero_serie" 
                            value={formData.numero_serie} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Pedimento</Label>
                        <Input 
                            name="pedimento" 
                            value={formData.pedimento} 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <Label>Observaciones</Label>
                    <Input 
                        as="textarea" 
                        name="observaciones" 
                        value={formData.observaciones} 
                        onChange={handleChange} 
                        rows={3}
                        style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                </FormGroup>
            </Form>
        </MobileModal>
    );
}

import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { EquipmentOutputForm, ButtonStyled } from '../components/FormComponents';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { getEquipmentOutputs, createEquipmentOutput, getEquipments, getUserLevel } from '../services/api';
import pb from '../services/pocketbase';

export function EquipmentOutputs() {
    const [outputs, setOutputs] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllHistory, setShowAllHistory] = useState(false);
    const { addToast } = useToast();
    const userLevel = getUserLevel();
    const canCreate = userLevel <= 2;

    const loadOutputs = async () => {
        try {
            let filters = [];
            if (searchTerm) {
                filters.push(`(producto ~ "${searchTerm}" || numero_serie ~ "${searchTerm}" || codigo ~ "${searchTerm}")`);
            }
            if (!showAllHistory) {
                const d = new Date(Date.now() - 14*24*60*60*1000);
                // Format: YYYY-MM-DD 00:00:00
                const fromDate = d.toISOString().replace('T', ' ').substring(0, 19);
                filters.push(`fecha >= "${fromDate}"`);
            }
            const filter = filters.join(' && ');
            
            const result = await getEquipmentOutputs(1, 100, filter);
            setOutputs(result.items);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar salidas', 'error');
        }
    };

    const loadEquipments = async () => {
        try {
            const result = await getEquipments(1, 500);
            setEquipments(result.items);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadOutputs();
    }, [searchTerm, showAllHistory]);

    useEffect(() => {
        let unsubscribeOutputs;
        let unsubscribeEquipments;

        const subscribe = async () => {
            try {
                unsubscribeOutputs = await pb.collection('equipment_outputs').subscribe('*', () => {
                    loadOutputs();
                });

                unsubscribeEquipments = await pb.collection('equipments').subscribe('*', () => {
                    loadEquipments();
                });
            } catch (err) {
                console.warn('Realtime subscribe failed:', err);
            }
        };

        loadEquipments();
        subscribe();

        return () => {
            try {
                if (unsubscribeOutputs) {
                    const maybePromise = unsubscribeOutputs();
                    if (maybePromise?.catch) {
                        maybePromise.catch(() => {}); // Silently ignore cleanup errors
                    }
                }
            } catch (err) {
                // Silently ignore
            }

            try {
                if (unsubscribeEquipments) {
                    const maybePromise = unsubscribeEquipments();
                    if (maybePromise?.catch) {
                        maybePromise.catch(() => {}); // Silently ignore cleanup errors
                    }
                }
            } catch (err) {
                // Silently ignore
            }
        };
    }, [searchTerm, showAllHistory]); // Re-subscribe when filters change to capture new closure

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSubmit = async ({ equipment, nota }) => {
        try {
            const outputData = {
                equipment_id: equipment.id,
                codigo: equipment.codigo,
                producto: equipment.producto,
                marca: equipment.marca,
                modelo: equipment.modelo,
                numero_serie: equipment.numero_serie,
                nota: nota,
                fecha: new Date().toISOString()
            };

            await createEquipmentOutput(outputData);
            addToast('Salida registrada correctamente', 'success');
            setIsModalOpen(false);
            loadOutputs();
            loadEquipments();
        } catch (error) {
            console.error(error);
            addToast('Error al registrar salida: ' + error.message, 'error');
        }
    };

    const columns = [
        { header: 'Fecha', render: (row) => new Date(row.fecha).toLocaleDateString() + ' ' + new Date(row.fecha).toLocaleTimeString() },
        { header: 'Producto', accessor: 'producto' },
        { header: 'Marca', accessor: 'marca' },
        { header: 'Modelo', accessor: 'modelo' },
        { header: 'No. Serie', accessor: 'numero_serie' },
        { header: 'Nota', accessor: 'nota' },
    ];

    return (
        <div>
            <SimpleTable 
                title="Salidas de Equipos" 
                columns={columns} 
                data={outputs} 
                onSearch={handleSearch}
                actions={
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--font-color-secondary)' }}>
                            <input 
                                type="checkbox" 
                                checked={showAllHistory} 
                                onChange={e => setShowAllHistory(e.target.checked)} 
                                style={{ cursor: 'pointer' }}
                            />
                            Mostrar todo el historial
                        </label>
                        {canCreate && (
                            <ButtonStyled onClick={() => setIsModalOpen(true)}>
                                Registrar Salida
                            </ButtonStyled>
                        )}
                    </div>
                }
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Registrar Salida de Equipo"
            >
                <EquipmentOutputForm 
                    equipments={equipments} 
                    onSubmit={handleSubmit} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>
        </div>
    );
}

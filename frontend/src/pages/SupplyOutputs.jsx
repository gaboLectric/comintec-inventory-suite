import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { SupplyOutputForm } from '../components/FormComponents';
import { GlassButton } from '../components/GlassButton';
import { MobileModal } from '../components/MobileModal';
import { useToast } from '../components/Toast';
import { getSupplyOutputs, createSupplyOutput, getSupplies, getUserLevel } from '../services/api';
import pb from '../services/pocketbase';

export function SupplyOutputs() {
    const [outputs, setOutputs] = useState([]);
    const [supplies, setSupplies] = useState([]);
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
                filters.push(`nombre ~ "${searchTerm}"`);
            }
            if (!showAllHistory) {
                const d = new Date(Date.now() - 14*24*60*60*1000);
                // Format: YYYY-MM-DD 00:00:00
                const fromDate = d.toISOString().replace('T', ' ').substring(0, 19);
                filters.push(`fecha >= "${fromDate}"`);
            }
            const filter = filters.join(' && ');

            const result = await getSupplyOutputs(1, 100, filter);
            setOutputs(result.items);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar salidas', 'error');
        }
    };

    const loadSupplies = async () => {
        try {
            const result = await getSupplies(1, 500);
            setSupplies(result.items);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadOutputs();
    }, [searchTerm, showAllHistory]);

    useEffect(() => {
        let unsubscribeOutputs;
        let unsubscribeSupplies;

        const subscribe = async () => {
            try {
                unsubscribeOutputs = await pb.collection('supply_outputs').subscribe('*', () => {
                    loadOutputs();
                });

                unsubscribeSupplies = await pb.collection('supplies').subscribe('*', () => {
                    loadSupplies();
                });
            } catch (err) {
                console.warn('Realtime subscribe failed:', err);
            }
        };

        loadSupplies();
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
                if (unsubscribeSupplies) {
                    const maybePromise = unsubscribeSupplies();
                    if (maybePromise?.catch) {
                        maybePromise.catch(() => {}); // Silently ignore cleanup errors
                    }
                }
            } catch (err) {
                // Silently ignore
            }
        };
    }, [searchTerm, showAllHistory]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSubmit = async ({ supply, cantidad, nota }) => {
        try {
            const outputData = {
                supply_id: supply.id,
                nombre: supply.nombre,
                cantidad: Number(cantidad),
                nota: nota,
                fecha: new Date().toISOString()
            };

            await createSupplyOutput(outputData);
            addToast('Salida registrada correctamente', 'success');
            setIsModalOpen(false);
            loadOutputs();
            loadSupplies();
        } catch (error) {
            console.error(error);
            addToast('Error al registrar salida: ' + error.message, 'error');
        }
    };

    const columns = [
        { header: 'Fecha', render: (row) => new Date(row.fecha).toLocaleDateString() + ' ' + new Date(row.fecha).toLocaleTimeString() },
        { header: 'Insumo', accessor: 'nombre' },
        { header: 'Cantidad', accessor: 'cantidad' },
        { header: 'Nota', accessor: 'nota' },
    ];

    return (
        <div>
            <SimpleTable 
                title="Salidas de Insumos" 
                columns={columns} 
                data={outputs} 
                onSearch={handleSearch}
                actions={
                    <div className="actions-row">
                        <label className="actions-label" style={{ fontSize: '0.875rem', color: 'var(--font-color-secondary)' }}>
                            <input 
                                type="checkbox" 
                                checked={showAllHistory} 
                                onChange={e => setShowAllHistory(e.target.checked)} 
                                style={{ cursor: 'pointer' }}
                            />
                            Mostrar todo el historial
                        </label>
                        {canCreate && (
                            <GlassButton variant="primary" onClick={() => setIsModalOpen(true)} className="actions-button">
                                Registrar Salida
                            </GlassButton>
                        )}
                    </div>
                }
            />

            <MobileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Registrar Salida de Insumo"
            >
                <SupplyOutputForm 
                    supplies={supplies} 
                    onSubmit={handleSubmit} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </MobileModal>
        </div>
    );
}

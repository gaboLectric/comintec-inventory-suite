import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { SupplyForm, ButtonStyled } from '../components/FormComponents';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { getSupplies, createSupply, updateSupply, deleteSupply, getUserLevel, checkLowStock } from '../services/api';
import pb from '../services/pocketbase';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';

export function Supplies() {
    const [supplies, setSupplies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupply, setEditingSupply] = useState(null);
    const { addToast } = useToast();
    const userLevel = getUserLevel();
    const canEdit = userLevel <= 2;

    const loadSupplies = async (filter = '') => {
        try {
            const result = await getSupplies(1, 100, filter);
            setSupplies(result.items);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar insumos', 'error');
        }
    };

    useEffect(() => {
        let unsubscribe;

        const subscribe = async () => {
            try {
                unsubscribe = await pb.collection('supplies').subscribe('*', () => {
                    loadSupplies();
                });
            } catch (err) {
                console.warn('Realtime subscribe failed:', err);
            }
        };

        loadSupplies();
        
        checkLowStock().then(low => {
            if (low.length > 0) {
                addToast(`Atención: ${low.length} insumos con bajo stock`, 'warning');
            }
        });

        subscribe();

        return () => {
            try {
                if (unsubscribe) {
                    const maybePromise = unsubscribe();
                    if (maybePromise?.catch) {
                        maybePromise.catch(() => {}); // Silently ignore cleanup errors
                    }
                }
            } catch (err) {
                // Silently ignore
            }
        };
    }, []);

    const handleSearch = (term) => {
        const filter = term ? `nombre ~ "${term}"` : '';
        loadSupplies(filter);
    };

    const handleSubmit = async (data) => {
        try {
            if (editingSupply) {
                await updateSupply(editingSupply.id, data);
                addToast('Insumo actualizado', 'success');
            } else {
                await createSupply(data);
                addToast('Insumo creado', 'success');
            }
            setIsModalOpen(false);
            setEditingSupply(null);
            loadSupplies();
        } catch (error) {
            console.error(error);
            addToast('Error al guardar insumo: ' + error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este insumo?')) {
            try {
                await deleteSupply(id);
                addToast('Insumo eliminado', 'success');
                loadSupplies();
            } catch (error) {
                addToast('Error al eliminar insumo', 'error');
            }
        }
    };

    const columns = [
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Piezas', render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: row.piezas < row.stock_deseado ? 'var(--brand-red-9)' : 'inherit', fontWeight: row.piezas < row.stock_deseado ? 'bold' : 'normal' }}>
                {row.piezas}
                {row.piezas < row.stock_deseado && <AlertTriangle size={16} />}
            </div>
        )},
        { header: 'Stock Deseado', accessor: 'stock_deseado' },
        { header: 'Estado', render: (row) => (
            row.piezas < row.stock_deseado ? 
            <span style={{ color: 'var(--brand-red-9)', fontWeight: 'bold' }}>BAJO STOCK</span> : 
            <span style={{ color: 'var(--brand-green-9)' }}>OK</span>
        )},
        { header: 'Acciones', render: (row) => (
            canEdit && (
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => { setEditingSupply(row); setIsModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-blue-9)' }}>
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(row.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-red-9)' }}>
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        )}
    ];

    return (
        <div>
            <SimpleTable 
                title="Inventario de Insumos" 
                columns={columns} 
                data={supplies} 
                onSearch={handleSearch}
                actions={
                    canEdit && (
                        <ButtonStyled onClick={() => { setEditingSupply(null); setIsModalOpen(true); }}>
                            Agregar Insumo
                        </ButtonStyled>
                    )
                }
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingSupply ? 'Editar Insumo' : 'Nuevo Insumo'}
            >
                <SupplyForm 
                    initialData={editingSupply} 
                    onSubmit={handleSubmit} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>
        </div>
    );
}

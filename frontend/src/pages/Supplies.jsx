import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { SupplyForm, ButtonStyled } from '../components/FormComponents';
import { Modal } from '../components/Modal';
import { ImportModal } from '../components/ImportModal';
import { useToast } from '../components/Toast';
import { getSupplies, createSupply, updateSupply, deleteSupply, getUserLevel, checkLowStock } from '../services/api';
import pb from '../services/pocketbase';
import { Edit, Trash2, AlertTriangle, Upload, Download } from 'lucide-react';
import { exportData } from '../services/importService';
import { getErrorMessage } from '../utils/errorHandler';

export function Supplies() {
    const [supplies, setSupplies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentFilter, setCurrentFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [editingSupply, setEditingSupply] = useState(null);
    const { addToast } = useToast();
    const userLevel = getUserLevel();
    const canEdit = userLevel <= 2;
    const isAdmin = userLevel === 1;

    const loadSupplies = async (pageToLoad = 1, filter = '') => {
        try {
            const result = await getSupplies(pageToLoad, 50, filter);
            setSupplies(result.items);
            setPage(result.page);
            setTotalPages(result.totalPages);
            setTotalItems(result.totalItems);
        } catch (error) {
            console.error(error);
            addToast(getErrorMessage(error), 'error');
        }
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
            loadSupplies(page, currentFilter);
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
                loadSupplies(page, currentFilter);
            } catch (error) {
                addToast('Error al eliminar insumo', 'error');
            }
        }
    };

    useEffect(() => {
        let unsubscribe;

        const subscribe = async () => {
            try {
                unsubscribe = await pb.collection('supplies').subscribe('*', () => {
                    loadSupplies(page, currentFilter);
                });
            } catch (err) {
                console.warn('Realtime subscribe failed:', err);
            }
        };

        loadSupplies();
        
        checkLowStock().then(low => {
            if (low.length > 0) {
                addToast(`Atención: ${low.length} insumos con bajo stock`, 'warning', { placement: 'top-right', important: true, durationMs: 10000 });
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
        setCurrentFilter(filter);
        setPage(1);
        loadSupplies(1, filter);
    };

    const handlePageChange = (newPage) => {
        loadSupplies(newPage, currentFilter);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportData('supplies');
            addToast('Inventario de insumos exportado con éxito', 'success');
        } catch (error) {
            addToast('Error al exportar inventario', 'error');
        } finally {
            setIsExporting(false);
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
                pagination={{
                    page,
                    totalPages,
                    totalItems,
                    onPageChange: handlePageChange
                }}
                actions={
                    canEdit && (
                        <div style={{ display: 'flex', gap: 10 }}>
                            {isAdmin && (
                                <>
                                    <ButtonStyled onClick={() => setIsImportModalOpen(true)} $variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Upload size={16} /> Importar
                                    </ButtonStyled>
                                    <ButtonStyled onClick={handleExport} $variant="secondary" disabled={isExporting} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Download size={16} /> Exportar
                                    </ButtonStyled>
                                </>
                            )}
                            <ButtonStyled onClick={() => { setEditingSupply(null); setIsModalOpen(true); }}>
                                Agregar Insumo
                            </ButtonStyled>
                        </div>
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

            <ImportModal 
                isOpen={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)} 
                type="supplies" 
                onImportComplete={() => loadSupplies(1, currentFilter)} 
            />
        </div>
    );
}

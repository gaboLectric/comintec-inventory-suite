import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { ButtonStyled } from '../components/FormComponents';
import { ImageModal } from '../components/Modal';
import { EquipmentDetailModal } from '../components/EquipmentDetailModal';
import { EquipmentQRModal } from '../components/EquipmentQRModal';
import { EquipmentEditModal } from '../components/EquipmentEditModal';
import { useToast } from '../components/Toast';
import { getEquipments, getUserLevel } from '../services/api';
import pb from '../services/pocketbase';
import { Eye, QrCode, Edit } from 'lucide-react';

export function Equipments() {
    const [equipments, setEquipments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentFilter, setCurrentFilter] = useState('');
    const [viewingEquipment, setViewingEquipment] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [selectedQREquipment, setSelectedQREquipment] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [showSold, setShowSold] = useState(false);
    const { addToast } = useToast();
    const userLevel = getUserLevel();

    const loadEquipments = async (pageToLoad = 1, filter = '') => {
        try {
            let finalFilter = filter;
            if (!showSold) {
                finalFilter = filter ? `(${filter}) && vendido = false` : 'vendido = false';
            }
            const result = await getEquipments(pageToLoad, 50, finalFilter);
            setEquipments(result.items);
            setPage(result.page);
            setTotalPages(result.totalPages);
            setTotalItems(result.totalItems);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar equipos', 'error');
        }
    };

    useEffect(() => {
        loadEquipments(1, currentFilter);
    }, [showSold]);

    useEffect(() => {
        let unsubscribe;

        const subscribe = async () => {
            try {
                unsubscribe = await pb.collection('equipments').subscribe('*', () => {
                    loadEquipments(page, currentFilter);
                });
            } catch (err) {
                console.warn('Realtime subscribe failed:', err);
            }
        };

        loadEquipments();
        subscribe();

        return () => {
            try {
                if (unsubscribe) {
                    const maybePromise = unsubscribe();
                    if (maybePromise?.catch) {
                        maybePromise.catch(() => {});
                    }
                }
            } catch (err) {
                // Silently ignore
            }
        };
    }, []);

    const handleSearch = (term) => {
        const filter = term ? `producto ~ "${term}" || numero_serie ~ "${term}" || codigo ~ "${term}"` : '';
        setCurrentFilter(filter);
        setPage(1);
        loadEquipments(1, filter);
    };

    const handlePageChange = (newPage) => {
        loadEquipments(newPage, currentFilter);
    };

    const columns = [
        { header: 'Imagen', render: (row) => {
            const mediaRecord = row.expand?.media_id;
            if (mediaRecord && mediaRecord.file) {
                const thumbUrl = pb.files.getURL(mediaRecord, mediaRecord.file, { thumb: '100x100' });
                const fullUrl = pb.files.getURL(mediaRecord, mediaRecord.file);
                
                return (
                    <img 
                        src={thumbUrl} 
                        alt="Equipo" 
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                        onClick={() => {
                            setSelectedImage(fullUrl);
                            setIsImageModalOpen(true);
                        }}
                    />
                );
            }
            return <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />;
        }},
        { header: 'Código', accessor: 'codigo' },
        { header: 'Producto', accessor: 'producto' },
        { header: 'Marca', accessor: 'marca' },
        { header: 'Modelo', accessor: 'modelo', width: '90px' },
        { header: 'No. Serie', accessor: 'numero_serie' },
        { header: 'Pedimento', accessor: 'pedimento', width: '150px', render: (row) => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.pedimento}>
                {row.pedimento}
            </div>
        )},
        { header: 'Observaciones', width: '30%', render: (row) => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.observaciones}>
                {row.observaciones}
            </div>
        )},
        { header: 'Acciones', render: (row) => (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {row.vendido && (
                    <span style={{ 
                        backgroundColor: 'var(--brand-blue-2)', 
                        color: 'var(--brand-blue-9)', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold' 
                    }}>
                        VENDIDO
                    </span>
                )}
                {userLevel <= 2 && (
                    <button onClick={() => { setEditingEquipment(row); setIsEditModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-blue-9)' }} title="Editar">
                        <Edit size={18} />
                    </button>
                )}
                <button onClick={() => setViewingEquipment(row)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--font-color-secondary)' }} title="Ver detalles">
                    <Eye size={18} />
                </button>
                <button onClick={() => { setSelectedQREquipment(row); setIsQRModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-blue-9)' }} title="Ver QR">
                    <QrCode size={18} />
                </button>
            </div>
        )}
    ];

    return (
        <div>
            <SimpleTable 
                title="Inventario de Equipos" 
                columns={columns} 
                data={equipments} 
                onSearch={handleSearch}
                actions={
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--font-color-secondary)', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={showSold} 
                            onChange={(e) => setShowSold(e.target.checked)} 
                            style={{ accentColor: 'var(--brand-blue-9)' }}
                        />
                        Mostrar Vendidos
                    </label>
                }
                pagination={{
                    page,
                    totalPages,
                    totalItems,
                    onPageChange: handlePageChange
                }}
                rowStyle={(row) => row.vendido ? { backgroundColor: 'rgba(0, 123, 255, 0.1)' } : {}}
            />

            <ImageModal 
                isOpen={isImageModalOpen} 
                onClose={() => setIsImageModalOpen(false)} 
                imageUrl={selectedImage} 
            />

            <EquipmentDetailModal 
                isOpen={!!viewingEquipment} 
                onClose={() => setViewingEquipment(null)} 
                equipment={viewingEquipment} 
            />

            <EquipmentQRModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                equipment={selectedQREquipment}
            />

            <EquipmentEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                equipment={editingEquipment}
                onUpdate={() => loadEquipments(page, currentFilter)}
            />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { EquipmentForm, ButtonStyled } from '../components/FormComponents';
import { Modal, ImageModal } from '../components/Modal';
import { ImportModal } from '../components/ImportModal';
import { EquipmentDetailModal } from '../components/EquipmentDetailModal';
import { useToast } from '../components/Toast';
import { getEquipments, createEquipment, updateEquipment, deleteEquipment, getUserLevel } from '../services/api';
import pb from '../services/pocketbase';
import { Edit, Trash2, Upload, Eye } from 'lucide-react';

export function Equipments() {
    const [equipments, setEquipments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentFilter, setCurrentFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [viewingEquipment, setViewingEquipment] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { addToast } = useToast();
    const userLevel = getUserLevel();
    const canEdit = userLevel <= 2;
    const isAdmin = userLevel === 1;

    const loadEquipments = async (pageToLoad = 1, filter = '') => {
        try {
            const result = await getEquipments(pageToLoad, 50, filter);
            setEquipments(result.items);
            setPage(result.page);
            setTotalPages(result.totalPages);
            setTotalItems(result.totalItems);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar equipos', 'error');
        }
    };

    const handleSubmit = async (data, file) => {
        try {
            let mediaId = data.media_id;

            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const mediaRecord = await pb.collection('media').create(formData);
                mediaId = mediaRecord.id;
            }

            const equipmentData = { ...data, media_id: mediaId };

            if (editingEquipment) {
                await updateEquipment(editingEquipment.id, equipmentData);
                addToast('Equipo actualizado', 'success');
            } else {
                await createEquipment(equipmentData);
                addToast('Equipo creado', 'success');
            }
            setIsModalOpen(false);
            setEditingEquipment(null);
            loadEquipments(page, currentFilter);
        } catch (error) {
            console.error(error);
            addToast('Error al guardar equipo: ' + error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este equipo?')) {
            try {
                await deleteEquipment(id);
                addToast('Equipo eliminado', 'success');
                loadEquipments(page, currentFilter);
            } catch (error) {
                addToast('Error al eliminar equipo', 'error');
            }
        }
    };

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
                        maybePromise.catch(() => {}); // Silently ignore cleanup errors
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
        setPage(1); // Reset to first page on search
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
            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setViewingEquipment(row)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--font-color-secondary)' }} title="Ver detalles">
                    <Eye size={18} />
                </button>
                {canEdit && (
                    <>
                        <button onClick={() => { setEditingEquipment(row); setIsModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-blue-9)' }} title="Editar">
                            <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(row.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-red-9)' }} title="Eliminar">
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
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
                                <ButtonStyled onClick={() => setIsImportModalOpen(true)} $variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Upload size={16} /> Importar desde Excel
                                </ButtonStyled>
                            )}
                            <ButtonStyled onClick={() => { setEditingEquipment(null); setIsModalOpen(true); }}>
                                Agregar Equipo
                            </ButtonStyled>
                        </div>
                    )
                }
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingEquipment ? 'Editar Equipo' : 'Nuevo Equipo'}
            >
                <EquipmentForm 
                    initialData={editingEquipment} 
                    onSubmit={handleSubmit} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>

            <ImageModal 
                isOpen={isImageModalOpen} 
                onClose={() => setIsImageModalOpen(false)} 
                imageUrl={selectedImage} 
            />

            <ImportModal 
                isOpen={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)} 
                type="equipments" 
                onImportComplete={() => loadEquipments(1, currentFilter)} 
            />

            <EquipmentDetailModal 
                isOpen={!!viewingEquipment} 
                onClose={() => setViewingEquipment(null)} 
                equipment={viewingEquipment} 
            />
        </div>
    );
}

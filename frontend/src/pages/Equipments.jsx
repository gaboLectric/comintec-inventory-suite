import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { EquipmentForm, ButtonStyled } from '../components/FormComponents';
import { Modal, ImageModal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { getEquipments, createEquipment, updateEquipment, deleteEquipment, getUserLevel } from '../services/api';
import pb from '../services/pocketbase';
import { Edit, Trash2 } from 'lucide-react';

export function Equipments() {
    const [equipments, setEquipments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { addToast } = useToast();
    const userLevel = getUserLevel();
    const canEdit = userLevel <= 2;

    const loadEquipments = async (filter = '') => {
        try {
            const result = await getEquipments(1, 100, filter);
            setEquipments(result.items);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar equipos', 'error');
        }
    };

    useEffect(() => {
        let unsubscribe;

        const subscribe = async () => {
            try {
                unsubscribe = await pb.collection('equipments').subscribe('*', () => {
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
        loadEquipments(filter);
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
            loadEquipments();
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
                loadEquipments();
            } catch (error) {
                addToast('Error al eliminar equipo', 'error');
            }
        }
    };

    const columns = [
        { header: 'Imagen', render: (row) => (
            row.expand?.media_id ? (
                <img 
                    src={pb.files.getUrl(row.expand.media_id, row.expand.media_id.file, { thumb: '100x100' })} 
                    alt="Equipo" 
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                    onClick={() => {
                        setSelectedImage(pb.files.getUrl(row.expand.media_id, row.expand.media_id.file));
                        setIsImageModalOpen(true);
                    }}
                />
            ) : <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
        )},
        { header: 'Código', accessor: 'codigo' },
        { header: 'Producto', accessor: 'producto' },
        { header: 'Marca', accessor: 'marca' },
        { header: 'Modelo', accessor: 'modelo' },
        { header: 'No. Serie', accessor: 'numero_serie' },
        { header: 'Pedimento', accessor: 'pedimento' },
        { header: 'Acciones', render: (row) => (
            canEdit && (
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => { setEditingEquipment(row); setIsModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-blue-9)' }}>
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
                title="Inventario de Equipos" 
                columns={columns} 
                data={equipments} 
                onSearch={handleSearch}
                actions={
                    canEdit && (
                        <ButtonStyled onClick={() => { setEditingEquipment(null); setIsModalOpen(true); }}>
                            Agregar Equipo
                        </ButtonStyled>
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
        </div>
    );
}

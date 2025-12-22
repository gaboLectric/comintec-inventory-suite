import React, { useState, useEffect } from 'react';
import { SimpleTable } from '../components/SimpleTable';
import { EquipmentInputForm, ButtonStyled } from '../components/FormComponents';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { getEquipmentInputs, createEquipmentInput, getUserLevel } from '../services/api';
import pb from '../services/pocketbase';
import { Plus } from 'lucide-react';

export function EquipmentInputs() {
    const [inputs, setInputs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllHistory, setShowAllHistory] = useState(false);
    const { addToast } = useToast();
    const userLevel = getUserLevel();
    const canCreate = userLevel <= 2;

    const loadInputs = async (pageToLoad = 1) => {
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

            const result = await getEquipmentInputs(pageToLoad, 50, filter);
            setInputs(result.items);
            setPage(result.page);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error(error);
            addToast('Error al cargar entradas', 'error');
        }
    };

    useEffect(() => {
        loadInputs(1);
    }, [searchTerm, showAllHistory]);

    useEffect(() => {
        const subscribe = async () => {
            try {
                await pb.collection('equipment_inputs').subscribe('*', function (e) {
                    if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
                        loadInputs(page);
                    }
                });
            } catch (err) {
                console.warn('Realtime subscribe failed:', err);
            }
        };

        subscribe();

        return () => {
            pb.collection('equipment_inputs').unsubscribe('*');
        };
    }, [page, searchTerm, showAllHistory]);

    const handleCreate = async (data) => {
        try {
            let mediaId = null;
            
            // If there's a file, upload it first
            if (data.file) {
                const formData = new FormData();
                formData.append('file', data.file);
                const mediaRecord = await pb.collection('media').create(formData);
                mediaId = mediaRecord.id;
            }
            
            // Create the equipment input with media_id if file was uploaded
            const inputData = { 
                ...data,
                fecha: new Date().toISOString() // Ensure date is set to now
            };
            delete inputData.file; // Remove file from data
            if (mediaId) {
                inputData.media_id = mediaId;
            }
            
            await createEquipmentInput(inputData);
            addToast('Entrada registrada y equipo creado exitosamente', 'success');
            setIsModalOpen(false);
            loadInputs(1); // Reload to first page to see new entry
        } catch (error) {
            console.error(error);
            addToast('Error al registrar entrada: ' + error.message, 'error');
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(1);
    };

    const columns = [
        { header: 'Fecha', accessor: 'fecha', render: (row) => new Date(row.fecha).toLocaleString() },
        { header: 'Producto', accessor: 'producto' },
        { header: 'Marca', accessor: 'marca' },
        { header: 'Modelo', accessor: 'modelo' },
        { header: 'No. Serie', accessor: 'numero_serie' },
        { header: 'Pedimento', accessor: 'pedimento' },
        { header: 'Vendido', accessor: 'vendido', render: (row) => row.vendido ? (
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
        ) : 'No' },
        { header: 'Nota', accessor: 'nota' },
    ];

    return (
        <div className="p-6">
            <SimpleTable
                title="Entradas de Equipos"
                columns={columns}
                data={inputs}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
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
                                <Plus size={20} className="mr-2" />
                                Registrar Entrada
                            </ButtonStyled>
                        )}
                    </div>
                }
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Entrada de Equipo"
            >
                <EquipmentInputForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

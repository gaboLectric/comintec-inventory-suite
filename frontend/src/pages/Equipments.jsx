import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ResponsiveTable } from '../components/ResponsiveTable';
import { EquipmentCard } from '../components/EquipmentCard';
import { MobileImageModal } from '../components/MobileModal';
import { EquipmentDetailModal } from '../components/EquipmentDetailModal';
import { EquipmentQRModal } from '../components/EquipmentQRModal';
import { EquipmentEditModal } from '../components/EquipmentEditModal';
import { useToast } from '../components/Toast';
import { Loading, LoadingSkeleton } from '../components/Loading';
import { getEquipments, getUserLevel } from '../services/api';
import pb from '../services/pocketbase';
import { Eye, QrCode, Edit, Upload, Download } from 'lucide-react';
import { ImportModal } from '../components/ImportModal';
import { GlassButton } from '../components/GlassButton';
import { exportData } from '../services/importService';
import { getErrorMessage } from '../utils/errorHandler';

const TableActions = styled.div`
    display: flex;
    align-items: center;
    gap: var(--space-4);

    @media (max-width: 767px) {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-3);

        & > * {
            width: 100%;
        }
    }
`;

const SoldToggleLabel = styled.label`
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-sm);
    color: var(--font-color-secondary);
    cursor: pointer;
    user-select: none;

    @media (max-width: 767px) {
        justify-content: flex-start;
        padding: var(--space-2) var(--space-3);
        background: var(--glass-bg-medium);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
    }
`;

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
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showSold, setShowSold] = useState(true);
    // Performance optimization states
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { addToast } = useToast();
    const userLevel = getUserLevel();
    const isAdmin = userLevel === 1;

    const loadEquipments = async (pageToLoad = 1, filter = '', isSearch = false) => {
        try {
            // Set appropriate loading state
            if (isSearch) {
                setIsSearching(true);
            } else if (pageToLoad === 1) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

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
            addToast(getErrorMessage(error), 'error');
        } finally {
            // Clear all loading states
            setIsLoading(false);
            setIsLoadingMore(false);
            setIsSearching(false);
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
        loadEquipments(1, filter, true); // Mark as search operation
    };

    const handlePageChange = (newPage) => {
        // Smooth scroll to top on page change to prevent layout shifts
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadEquipments(newPage, currentFilter);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportData('equipments');
            addToast('Inventario de equipos exportado con éxito', 'success');
        } catch (error) {
            addToast('Error al exportar inventario', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const columns = [
        { header: 'Imagen', render: (row) => {
            const mediaRecord = row.expand?.media_id;
            if (mediaRecord && mediaRecord.file) {
                const thumbUrl = pb.files.getUrl(mediaRecord, mediaRecord.file, { thumb: '100x100' });
                const fullUrl = pb.files.getUrl(mediaRecord, mediaRecord.file);
                
                return (
                    <img 
                        src={thumbUrl} 
                        alt="Equipo" 
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                        onClick={() => {
                            setSelectedImage(fullUrl);
                            setIsImageModalOpen(true);
                        }}
                        loading="lazy" // Enable lazy loading for performance
                        onError={(e) => {
                            // Fallback for failed image loads
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
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
                    <button onClick={() => { setEditingEquipment(row); setIsEditModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FF6B35' }} title="Editar">
                        <Edit size={18} />
                    </button>
                )}
                <button onClick={() => setViewingEquipment(row)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--font-color-secondary)' }} title="Ver detalles">
                    <Eye size={18} />
                </button>
                <button onClick={() => { setSelectedQREquipment(row); setIsQRModalOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FF6B35' }} title="Ver QR">
                    <QrCode size={18} />
                </button>
            </div>
        )}
    ];

    return (
        <div>
            {isLoading ? (
                <LoadingSkeleton lines={8} />
            ) : (
                <ResponsiveTable 
                    title="Inventario de Equipos" 
                    columns={columns} 
                    data={equipments} 
                    onSearch={handleSearch}
                    isSearching={isSearching}
                    actions={
                        <TableActions>
                            {isAdmin && (
                                <>
                                    <GlassButton onClick={() => setIsImportModalOpen(true)} variant="secondary" icon={<Upload size={16} />}>
                                        Importar
                                    </GlassButton>
                                    <GlassButton onClick={handleExport} variant="secondary" disabled={isExporting} icon={<Download size={16} />}>
                                        {isExporting ? 'Exportando...' : 'Exportar'}
                                    </GlassButton>
                                </>
                            )}
                            <SoldToggleLabel>
                                <input 
                                    type="checkbox" 
                                    checked={showSold} 
                                    onChange={(e) => setShowSold(e.target.checked)} 
                                    style={{ accentColor: 'var(--brand-blue-9)' }}
                                />
                                Mostrar Vendidos
                            </SoldToggleLabel>
                        </TableActions>
                    }
                    pagination={{
                        page,
                        totalPages,
                        totalItems,
                        onPageChange: handlePageChange,
                        isLoadingMore
                    }}
                    rowStyle={(row) => row.vendido ? { backgroundColor: 'rgba(0, 123, 255, 0.1)' } : {}}
                    // Mobile card specific props
                    mobileCardRenderer={(equipment) => (
                        <EquipmentCard
                            equipment={equipment}
                            userLevel={userLevel}
                            onView={setViewingEquipment}
                            onEdit={(eq) => { setEditingEquipment(eq); setIsEditModalOpen(true); }}
                            onQR={(eq) => { setSelectedQREquipment(eq); setIsQRModalOpen(true); }}
                            onImageClick={(imageUrl) => { setSelectedImage(imageUrl); setIsImageModalOpen(true); }}
                        />
                    )}
                />
            )}

            <MobileImageModal 
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

            <ImportModal 
                isOpen={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)} 
                type="equipments" 
                onImportComplete={() => loadEquipments(1, currentFilter)} 
            />
        </div>
    );
}

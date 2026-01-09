'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, GripVertical, ExternalLink, Image } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getPartners, addPartner, updatePartner, deletePartner } from '@/lib/supabase';
import styles from './page.module.css';

export default function AdminPartnersPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const toast = useToast();

    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        url: '',
    });

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin())) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, isAdmin, router]);

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = async () => {
        setLoading(true);
        const { data, error } = await getPartners();
        if (!error && data) {
            setPartners(data);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Partner name is required');
            return;
        }

        try {
            if (editingPartner) {
                const { data, error } = await updatePartner(editingPartner.id, formData);
                if (error) throw error;
                setPartners(prev => prev.map(p => p.id === editingPartner.id ? { ...p, ...formData } : p));
                toast.success('Partner updated');
            } else {
                const { data, error } = await addPartner({ ...formData, order: partners.length + 1 });
                if (error) throw error;
                setPartners(prev => [...prev, data]);
                toast.success('Partner added');
            }

            setShowModal(false);
            setEditingPartner(null);
            setFormData({ name: '', logo: '', url: '' });
        } catch (error) {
            toast.error('Failed to save partner');
        }
    };

    const handleEdit = (partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            logo: partner.logo || '',
            url: partner.url || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await deletePartner(id);
            if (error) throw error;
            setPartners(prev => prev.filter(p => p.id !== id));
            toast.success('Partner deleted');
        } catch (error) {
            toast.error('Failed to delete partner');
        }
    };

    if (isLoading || !isAdmin()) {
        return <div className={styles.page}><div className={styles.loading}>Loading...</div></div>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={styles.title}>Partners</h1>
                <Button
                    size="sm"
                    leftIcon={<Plus size={16} />}
                    onClick={() => {
                        setEditingPartner(null);
                        setFormData({ name: '', logo: '', url: '' });
                        setShowModal(true);
                    }}
                >
                    Add
                </Button>
            </div>

            <p className={styles.description}>
                Manage partner logos that appear on the homepage. Partners help build trust with users.
            </p>

            {loading ? (
                <div className={styles.loading}>Loading partners...</div>
            ) : partners.length === 0 ? (
                <div className={styles.empty}>
                    <Image size={48} />
                    <p>No partners added yet</p>
                    <Button
                        size="sm"
                        onClick={() => setShowModal(true)}
                        leftIcon={<Plus size={16} />}
                    >
                        Add First Partner
                    </Button>
                </div>
            ) : (
                <div className={styles.partnerList}>
                    {partners.map((partner) => (
                        <div key={partner.id} className={styles.partnerCard}>
                            <div className={styles.dragHandle}>
                                <GripVertical size={16} />
                            </div>

                            <div className={styles.partnerLogo}>
                                {partner.logo ? (
                                    <img src={partner.logo} alt={partner.name} />
                                ) : (
                                    <span>{partner.name.charAt(0)}</span>
                                )}
                            </div>

                            <div className={styles.partnerInfo}>
                                <h3>{partner.name}</h3>
                                {partner.url && (
                                    <a href={partner.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink size={12} />
                                        {partner.url}
                                    </a>
                                )}
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.actionButton} onClick={() => handleEdit(partner)}>
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.danger}`}
                                    onClick={() => handleDelete(partner.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingPartner ? 'Edit Partner' : 'Add Partner'}
                size="sm"
            >
                <div className={styles.formFields}>
                    <Input
                        label="Partner Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., TechCorp"
                        required
                    />
                    <Input
                        label="Logo URL"
                        value={formData.logo}
                        onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        hint="Enter a URL to the partner's logo image"
                    />
                    <Input
                        label="Website URL"
                        value={formData.url}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://partner-website.com"
                    />
                </div>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button onClick={handleSave}>{editingPartner ? 'Update' : 'Add'}</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

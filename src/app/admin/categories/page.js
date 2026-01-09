'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { generateId } from '@/lib/utils';
import styles from './page.module.css';

export default function AdminCategoriesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const toast = useToast();

    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', icon: 'FileText' });

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin())) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, isAdmin, router]);

    const handleSave = () => {
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        if (editingCategory) {
            setCategories(prev => prev.map(c =>
                c.id === editingCategory.id ? { ...c, ...formData } : c
            ));
            toast.success('Category updated');
        } else {
            const newCategory = {
                id: generateId('cat'),
                ...formData,
                count: 0,
            };
            setCategories(prev => [...prev, newCategory]);
            toast.success('Category created');
        }

        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', icon: 'FileText' });
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description, icon: category.icon });
        setShowModal(true);
    };

    const handleDelete = (categoryId) => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        toast.success('Category deleted');
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
                <h1 className={styles.title}>Categories</h1>
                <Button
                    size="sm"
                    leftIcon={<Plus size={16} />}
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', description: '', icon: 'FileText' });
                        setShowModal(true);
                    }}
                >
                    Add
                </Button>
            </div>

            <div className={styles.categoryList}>
                {categories.map(category => (
                    <div key={category.id} className={styles.categoryCard}>
                        <div className={styles.dragHandle}>
                            <GripVertical size={16} />
                        </div>
                        <div className={styles.categoryInfo}>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            {category.adminOnly && (
                                <span className={styles.adminBadge}>Admin Only</span>
                            )}
                        </div>
                        <span className={styles.count}>{category.count || 0}</span>
                        <div className={styles.actions}>
                            <button className={styles.actionButton} onClick={() => handleEdit(category)}>
                                <Edit2 size={16} />
                            </button>
                            {!category.adminOnly && (
                                <button
                                    className={`${styles.actionButton} ${styles.danger}`}
                                    onClick={() => handleDelete(category.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingCategory ? 'Edit Category' : 'New Category'}
                size="sm"
            >
                <div className={styles.formFields}>
                    <Input
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Category name"
                        required
                    />
                    <Input
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description"
                    />
                </div>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button onClick={handleSave}>{editingCategory ? 'Update' : 'Create'}</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Upload, X, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select, Checkbox } from '@/components/ui/Input';
import { getRegistrationById } from '@/lib/mockData';
import { useToast } from '@/context/ToastContext';
import { generateId } from '@/lib/utils';
import styles from './page.module.css';

export default function SubmitRegistrationPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();

    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const reg = getRegistrationById(params.id);
        if (reg) {
            setRegistration(reg);
            // Initialize form data
            const initialData = {};
            reg.formSchema?.forEach(field => {
                initialData[field.id] = field.type === 'checkbox' ? false : '';
            });
            setFormData(initialData);
        }
        setLoading(false);
    }, [params.id]);

    const handleChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
        if (errors[fieldId]) {
            setErrors(prev => ({ ...prev, [fieldId]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        registration.formSchema?.forEach(field => {
            if (field.required) {
                const value = formData[field.id];
                if (value === undefined || value === '' || value === false) {
                    newErrors[field.id] = `${field.label} is required`;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
            toast.success('Your registration has been submitted!');
        }, 1500);
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (!registration) {
        return (
            <div className={styles.page}>
                <div className={styles.notFound}>
                    <AlertCircle size={48} />
                    <h2>Registration Not Found</h2>
                    <p>The registration you're looking for doesn't exist.</p>
                    <Link href="/search">
                        <Button>Browse Registrations</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className={styles.page}>
                <div className={styles.success}>
                    <div className={styles.successIcon}>
                        <Check size={32} />
                    </div>
                    <h2>Registration Submitted!</h2>
                    <p>Thank you for registering for <strong>{registration.title}</strong>.</p>
                    <p className={styles.successHint}>
                        You can check back later for updates on your submission status.
                    </p>
                    <div className={styles.successActions}>
                        <Link href={`/registration/${registration.id}`}>
                            <Button variant="outline">View Registration</Button>
                        </Link>
                        <Link href="/">
                            <Button>Go Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const renderField = (field) => {
        const commonProps = {
            key: field.id,
            label: field.label,
            required: field.required,
            error: errors[field.id],
            placeholder: field.placeholder,
        };

        switch (field.type) {
            case 'text':
            case 'email':
            case 'phone':
            case 'vin':
            case 'id':
            case 'url':
            case 'number':
                return (
                    <Input
                        {...commonProps}
                        type={field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : 'text'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                );

            case 'select':
            case 'radio':
                return (
                    <Select
                        {...commonProps}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        options={field.options || []}
                    />
                );

            case 'checkbox':
                return (
                    <Checkbox
                        {...commonProps}
                        checked={formData[field.id] || false}
                        onChange={(e) => handleChange(field.id, e.target.checked)}
                    />
                );

            case 'date':
                return (
                    <Input
                        {...commonProps}
                        type="date"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                );

            case 'file':
            case 'image':
                return (
                    <div key={field.id} className={styles.fileField}>
                        <label className={styles.fileLabel}>
                            {field.label}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        <div className={styles.fileUpload}>
                            <Upload size={20} />
                            <span>Click to upload or drag and drop</span>
                            <input
                                type="file"
                                accept={field.accept || (field.type === 'image' ? 'image/*' : '*')}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleChange(field.id, file.name);
                                    }
                                }}
                            />
                        </div>
                        {formData[field.id] && (
                            <div className={styles.fileName}>
                                {formData[field.id]}
                                <button onClick={() => handleChange(field.id, '')}>
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        {errors[field.id] && (
                            <span className={styles.errorMessage}>{errors[field.id]}</span>
                        )}
                    </div>
                );

            default:
                return (
                    <Input
                        {...commonProps}
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                );
        }
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Register</h1>
                    <p className={styles.subtitle}>{registration.title}</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formFields}>
                    {registration.formSchema?.map(field => renderField(field))}
                </div>

                <div className={styles.formActions}>
                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        loading={submitting}
                    >
                        Submit Registration
                    </Button>
                    <p className={styles.disclaimer}>
                        By submitting, you agree to share this information with the host.
                    </p>
                </div>
            </form>
        </div>
    );
}

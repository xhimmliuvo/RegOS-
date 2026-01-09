'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ChevronRight,
    ChevronLeft,
    Type,
    Mail,
    Phone,
    AlignLeft,
    ListOrdered,
    CheckSquare,
    Calendar,
    Upload,
    Image,
    Link as LinkIcon,
    Hash,
    Plus,
    Trash2,
    GripVertical
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select, Checkbox } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MOCK_CATEGORIES, PRICING, DURATION_LABELS } from '@/lib/mockData';
import { generateId, formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// Field type icons
const fieldTypeIcons = {
    text: Type,
    email: Mail,
    phone: Phone,
    textarea: AlignLeft,
    select: ListOrdered,
    checkbox: CheckSquare,
    date: Calendar,
    file: Upload,
    image: Image,
    url: LinkIcon,
    number: Hash,
};

const STEPS = [
    { id: 'basics', title: 'Basic Info' },
    { id: 'duration', title: 'Duration' },
    { id: 'form', title: 'Form Builder' },
    { id: 'preview', title: 'Preview' },
];

export default function CreateRegistrationPage() {
    const router = useRouter();
    const { user, canCreateRegistration } = useAuth();
    const toast = useToast();

    const [currentStep, setCurrentStep] = useState(0);
    const [registration, setRegistration] = useState({
        title: '',
        description: '',
        category: '',
        visibility: 'public',
        duration: '7days',
        formSchema: [
            { id: generateId('field'), type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
            { id: generateId('field'), type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
        ],
    });
    const [errors, setErrors] = useState({});
    const [publishing, setPublishing] = useState(false);

    const publicCategories = MOCK_CATEGORIES.filter(c => !c.adminOnly);

    const handleChange = (field, value) => {
        setRegistration(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 0) {
            if (!registration.title.trim()) newErrors.title = 'Title is required';
            if (!registration.description.trim()) newErrors.description = 'Description is required';
            if (!registration.category) newErrors.category = 'Category is required';
        }

        if (step === 2) {
            if (registration.formSchema.length === 0) {
                toast.error('Add at least one form field');
                return false;
            }
            const hasEmptyLabel = registration.formSchema.some(f => !f.label.trim());
            if (hasEmptyLabel) {
                toast.error('All fields must have a label');
                return false;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Form builder functions
    const addField = (type) => {
        const newField = {
            id: generateId('field'),
            type,
            label: '',
            required: false,
            placeholder: '',
            options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
        };
        setRegistration(prev => ({
            ...prev,
            formSchema: [...prev.formSchema, newField],
        }));
    };

    const updateField = (fieldId, updates) => {
        setRegistration(prev => ({
            ...prev,
            formSchema: prev.formSchema.map(f =>
                f.id === fieldId ? { ...f, ...updates } : f
            ),
        }));
    };

    const removeField = (fieldId) => {
        setRegistration(prev => ({
            ...prev,
            formSchema: prev.formSchema.filter(f => f.id !== fieldId),
        }));
    };

    const handlePublish = async () => {
        if (!validateStep(currentStep)) return;

        setPublishing(true);

        // Simulate API call
        setTimeout(() => {
            setPublishing(false);
            toast.success('Registration created successfully!');
            router.push('/dashboard');
        }, 1500);
    };

    const selectedPrice = PRICING.publish[registration.duration] || 0;

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={styles.title}>Create Registration</h1>
            </div>

            {/* Progress Steps */}
            <div className={styles.progress}>
                {STEPS.map((step, index) => (
                    <div
                        key={step.id}
                        className={`${styles.step} ${index === currentStep ? styles.active : ''} ${index < currentStep ? styles.completed : ''}`}
                    >
                        <div className={styles.stepNumber}>{index + 1}</div>
                        <span className={styles.stepTitle}>{step.title}</span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className={styles.content}>
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>Tell us about your registration</h2>

                        <Input
                            label="Title"
                            placeholder="e.g., Tech Conference 2026"
                            value={registration.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            error={errors.title}
                            required
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe your registration, event, or form..."
                            value={registration.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            error={errors.description}
                            rows={4}
                            required
                        />

                        <Select
                            label="Category"
                            placeholder="Select a category"
                            value={registration.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            options={publicCategories.map(c => ({ value: c.id, label: c.name }))}
                            error={errors.category}
                            required
                        />

                        <div className={styles.visibilitySelect}>
                            <label className={styles.visibilityLabel}>Visibility</label>
                            <div className={styles.visibilityOptions}>
                                <button
                                    type="button"
                                    className={`${styles.visibilityOption} ${registration.visibility === 'public' ? styles.selected : ''}`}
                                    onClick={() => handleChange('visibility', 'public')}
                                >
                                    <span>🌍</span>
                                    <div>
                                        <strong>Public</strong>
                                        <p>Anyone can find and register</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.visibilityOption} ${registration.visibility === 'private' ? styles.selected : ''}`}
                                    onClick={() => handleChange('visibility', 'private')}
                                >
                                    <span>🔒</span>
                                    <div>
                                        <strong>Private</strong>
                                        <p>Only people with link can access</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Duration */}
                {currentStep === 1 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>Choose duration</h2>
                        <p className={styles.stepDescription}>
                            Select how long your registration should be active
                        </p>

                        <div className={styles.durationGrid}>
                            {Object.entries(PRICING.publish).map(([key, price]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`${styles.durationCard} ${registration.duration === key ? styles.selected : ''}`}
                                    onClick={() => handleChange('duration', key)}
                                >
                                    <span className={styles.durationLabel}>{DURATION_LABELS[key]}</span>
                                    <span className={styles.durationPrice}>{formatCurrency(price)}</span>
                                </button>
                            ))}
                        </div>

                        <div className={styles.priceSummary}>
                            <span>Total to pay:</span>
                            <span className={styles.totalPrice}>{formatCurrency(selectedPrice)}</span>
                        </div>
                    </div>
                )}

                {/* Step 3: Form Builder */}
                {currentStep === 2 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>Build your form</h2>
                        <p className={styles.stepDescription}>
                            Add and customize fields for your registration form
                        </p>

                        {/* Add Field Buttons */}
                        <div className={styles.addFieldSection}>
                            <span className={styles.addFieldLabel}>Add field:</span>
                            <div className={styles.addFieldButtons}>
                                {Object.entries(fieldTypeIcons).slice(0, 6).map(([type, Icon]) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={styles.addFieldButton}
                                        onClick={() => addField(type)}
                                        title={type}
                                    >
                                        <Icon size={16} />
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className={styles.addFieldButton}
                                    onClick={() => addField('text')}
                                    title="More"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Fields List */}
                        <div className={styles.fieldsList}>
                            {registration.formSchema.map((field, index) => {
                                const Icon = fieldTypeIcons[field.type] || Type;
                                return (
                                    <div key={field.id} className={styles.fieldItem}>
                                        <div className={styles.fieldDrag}>
                                            <GripVertical size={16} />
                                        </div>
                                        <div className={styles.fieldIcon}>
                                            <Icon size={16} />
                                        </div>
                                        <div className={styles.fieldInputs}>
                                            <input
                                                type="text"
                                                placeholder="Field label"
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                className={styles.fieldLabelInput}
                                            />
                                            <div className={styles.fieldOptions}>
                                                <label className={styles.requiredToggle}>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                    />
                                                    Required
                                                </label>
                                                <span className={styles.fieldType}>{field.type}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.removeField}
                                            onClick={() => removeField(field.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {registration.formSchema.length === 0 && (
                            <div className={styles.noFields}>
                                <p>No fields added yet. Click the buttons above to add fields.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Preview */}
                {currentStep === 3 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>Preview & Publish</h2>

                        <div className={styles.previewCard}>
                            <div className={styles.previewBanner} />
                            <div className={styles.previewContent}>
                                <span className={styles.previewCategory}>{registration.category}</span>
                                <h3 className={styles.previewTitle}>{registration.title || 'Untitled'}</h3>
                                <p className={styles.previewDescription}>{registration.description || 'No description'}</p>

                                <div className={styles.previewMeta}>
                                    <span>📅 {DURATION_LABELS[registration.duration]}</span>
                                    <span>🌍 {registration.visibility === 'public' ? 'Public' : 'Private'}</span>
                                    <span>📝 {registration.formSchema.length} fields</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.publishSummary}>
                            <div className={styles.summaryRow}>
                                <span>Duration</span>
                                <span>{DURATION_LABELS[registration.duration]}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Form Fields</span>
                                <span>{registration.formSchema.length}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Amount to Pay</span>
                                <span>{formatCurrency(selectedPrice)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className={styles.footer}>
                {currentStep > 0 && (
                    <Button variant="outline" onClick={prevStep} leftIcon={<ChevronLeft size={18} />}>
                        Back
                    </Button>
                )}
                <div className={styles.footerSpacer} />
                {currentStep < STEPS.length - 1 ? (
                    <Button onClick={nextStep} rightIcon={<ChevronRight size={18} />}>
                        Continue
                    </Button>
                ) : (
                    <Button onClick={handlePublish} loading={publishing}>
                        Pay {formatCurrency(selectedPrice)} & Publish
                    </Button>
                )}
            </div>
        </div>
    );
}

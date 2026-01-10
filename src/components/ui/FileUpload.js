'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, Check } from 'lucide-react';
import styles from './FileUpload.module.css';

const ACCEPTED_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    pdf: ['application/pdf'],
    all: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUpload({
    label,
    accept = 'all',
    multiple = false,
    maxFiles = 5,
    onFilesChange,
    error,
    helperText,
}) {
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const inputRef = useRef(null);

    const acceptedTypes = ACCEPTED_TYPES[accept] || ACCEPTED_TYPES.all;

    const handleFiles = (newFiles) => {
        setUploadError('');
        const validFiles = [];

        for (const file of newFiles) {
            // Check type
            if (!acceptedTypes.includes(file.type)) {
                setUploadError(`Invalid file type. Accepted: ${accept === 'image' ? 'images' : accept === 'pdf' ? 'PDFs' : 'images and PDFs'}`);
                continue;
            }

            // Check size
            if (file.size > MAX_SIZE) {
                setUploadError('File too large. Max size: 5MB');
                continue;
            }

            // Check max files
            if (files.length + validFiles.length >= maxFiles) {
                setUploadError(`Maximum ${maxFiles} files allowed`);
                break;
            }

            // Create preview for images
            const fileData = {
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            };

            validFiles.push(fileData);
        }

        if (validFiles.length > 0) {
            const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
            setFiles(updatedFiles);
            onFilesChange?.(updatedFiles);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (id) => {
        const updatedFiles = files.filter(f => f.id !== id);
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <Image size={20} />;
        if (type === 'application/pdf') return <FileText size={20} />;
        return <File size={20} />;
    };

    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                className={`${styles.dropzone} ${dragActive ? styles.active : ''} ${error ? styles.error : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    accept={acceptedTypes.join(',')}
                    onChange={handleChange}
                    className={styles.input}
                />
                <Upload size={32} className={styles.icon} />
                <p className={styles.text}>
                    <span className={styles.highlight}>Click to upload</span> or drag and drop
                </p>
                <p className={styles.hint}>
                    {accept === 'image' ? 'PNG, JPG, GIF, WEBP' : accept === 'pdf' ? 'PDF only' : 'Images or PDFs'} up to 5MB
                </p>
            </div>

            {(uploadError || error) && (
                <p className={styles.errorText}>{uploadError || error}</p>
            )}

            {helperText && !error && !uploadError && (
                <p className={styles.helperText}>{helperText}</p>
            )}

            {files.length > 0 && (
                <div className={styles.fileList}>
                    {files.map((fileData) => (
                        <div key={fileData.id} className={styles.fileItem}>
                            {fileData.preview ? (
                                <img src={fileData.preview} alt={fileData.name} className={styles.preview} />
                            ) : (
                                <div className={styles.fileIcon}>
                                    {getFileIcon(fileData.type)}
                                </div>
                            )}
                            <div className={styles.fileInfo}>
                                <span className={styles.fileName}>{fileData.name}</span>
                                <span className={styles.fileSize}>{formatSize(fileData.size)}</span>
                            </div>
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(fileData.id);
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

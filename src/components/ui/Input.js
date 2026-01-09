'use client';

import { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({
    type = 'text',
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    fullWidth = true,
    className = '',
    ...props
}, ref) => {
    const inputId = props.id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {props.required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
                {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={`${styles.input} ${leftIcon ? styles.hasLeftIcon : ''} ${rightIcon ? styles.hasRightIcon : ''}`}
                    {...props}
                />
                {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
            </div>

            {(error || hint) && (
                <span className={`${styles.message} ${error ? styles.errorMessage : ''}`}>
                    {error || hint}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

// Textarea component
export const Textarea = forwardRef(({
    label,
    error,
    hint,
    fullWidth = true,
    rows = 4,
    className = '',
    ...props
}, ref) => {
    const inputId = props.id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {props.required && <span className={styles.required}>*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                id={inputId}
                rows={rows}
                className={`${styles.textarea} ${error ? styles.hasError : ''}`}
                {...props}
            />

            {(error || hint) && (
                <span className={`${styles.message} ${error ? styles.errorMessage : ''}`}>
                    {error || hint}
                </span>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// Select component
export const Select = forwardRef(({
    label,
    error,
    hint,
    options = [],
    placeholder = 'Select an option',
    fullWidth = true,
    className = '',
    ...props
}, ref) => {
    const inputId = props.id || props.name || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {props.required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.selectWrapper}>
                <select
                    ref={ref}
                    id={inputId}
                    className={`${styles.select} ${error ? styles.hasError : ''}`}
                    {...props}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option, index) => (
                        <option key={index} value={typeof option === 'string' ? option : option.value}>
                            {typeof option === 'string' ? option : option.label}
                        </option>
                    ))}
                </select>
                <span className={styles.selectArrow}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>

            {(error || hint) && (
                <span className={`${styles.message} ${error ? styles.errorMessage : ''}`}>
                    {error || hint}
                </span>
            )}
        </div>
    );
});

Select.displayName = 'Select';

// Checkbox component
export const Checkbox = forwardRef(({
    label,
    error,
    className = '',
    ...props
}, ref) => {
    const inputId = props.id || props.name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.checkboxWrapper} ${className}`}>
            <input
                ref={ref}
                id={inputId}
                type="checkbox"
                className={styles.checkbox}
                {...props}
            />
            <label htmlFor={inputId} className={styles.checkboxLabel}>
                <span className={styles.checkboxBox}>
                    <svg viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                {label}
            </label>
            {error && <span className={`${styles.message} ${styles.errorMessage}`}>{error}</span>}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input, { Checkbox } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { isValidEmail } from '@/lib/utils';
import styles from '../login/page.module.css';

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            login({
                email: formData.email,
                name: formData.name,
                role: 'agent', // New users start as agents
                verified: false,
            });

            toast.success('Welcome to RegOS!', { title: 'Account created successfully' });
            router.push('/dashboard');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create your account</h1>
                    <p className={styles.subtitle}>Start managing your registrations today</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        leftIcon={<User size={18} />}
                        autoComplete="name"
                    />

                    <Input
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        leftIcon={<Mail size={18} />}
                        autoComplete="email"
                    />

                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        leftIcon={<Lock size={18} />}
                        rightIcon={
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                        autoComplete="new-password"
                    />

                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        leftIcon={<Lock size={18} />}
                        autoComplete="new-password"
                    />

                    <Checkbox
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        error={errors.acceptTerms}
                        label={
                            <span>
                                I agree to the <Link href="/info/terms">Terms of Service</Link> and{' '}
                                <Link href="/info/privacy">Privacy Policy</Link>
                            </span>
                        }
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        loading={loading}
                        rightIcon={!loading && <ArrowRight size={18} />}
                    >
                        Create Account
                    </Button>
                </form>

                <p className={styles.footer}>
                    Already have an account? <Link href="/auth/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

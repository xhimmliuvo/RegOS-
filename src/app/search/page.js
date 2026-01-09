'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, SlidersHorizontal, Grid, List } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { MOCK_REGISTRATIONS, MOCK_CATEGORIES, searchRegistrations } from '@/lib/mockData';
import styles from './page.module.css';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || '';

    const [query, setQuery] = useState(initialQuery);
    const [searchInput, setSearchInput] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort registrations
    const filteredRegistrations = useMemo(() => {
        let results = searchRegistrations(query);

        // Filter by category
        if (category) {
            results = results.filter(r => r.category === category);
        }

        // Filter by status
        if (status) {
            results = results.filter(r => r.status === status);
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                results = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                results = [...results].sort((a, b) => b.viewCount - a.viewCount);
                break;
            case 'submissions':
                results = [...results].sort((a, b) => b.submissionCount - a.submissionCount);
                break;
            case 'ending':
                results = [...results].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
                break;
        }

        return results;
    }, [query, category, status, sortBy]);

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(searchInput);
    };

    const clearFilters = () => {
        setQuery('');
        setSearchInput('');
        setCategory('');
        setStatus('');
        setSortBy('newest');
    };

    const hasActiveFilters = query || category || status;
    const publicCategories = MOCK_CATEGORIES.filter(c => !c.adminOnly);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Search Registrations</h1>
                <p className={styles.subtitle}>
                    Discover events, appointments, and registrations
                </p>
            </div>

            {/* Search Bar */}
            <div className={styles.searchSection}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, category, or host..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchInput && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={() => {
                                    setSearchInput('');
                                    setQuery('');
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <Button type="submit">Search</Button>
                </form>

                <button
                    className={styles.filterToggle}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal size={18} />
                    Filters
                    {hasActiveFilters && <span className={styles.filterBadge} />}
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className={styles.filtersPanel}>
                    <div className={styles.filterGroup}>
                        <label>Category</label>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            options={publicCategories.map(c => ({ value: c.id, label: c.name }))}
                            placeholder="All Categories"
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Status</label>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'paused', label: 'Paused' },
                                { value: 'expired', label: 'Expired' },
                            ]}
                            placeholder="All Statuses"
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Sort By</label>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            options={[
                                { value: 'newest', label: 'Newest First' },
                                { value: 'popular', label: 'Most Popular' },
                                { value: 'submissions', label: 'Most Submissions' },
                                { value: 'ending', label: 'Ending Soon' },
                            ]}
                        />
                    </div>

                    {hasActiveFilters && (
                        <button className={styles.clearFilters} onClick={clearFilters}>
                            <X size={14} />
                            Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Results Header */}
            <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>
                    {filteredRegistrations.length} result{filteredRegistrations.length !== 1 ? 's' : ''}
                    {query && ` for "${query}"`}
                </span>

                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            {filteredRegistrations.length > 0 ? (
                <div className={`${styles.results} ${styles[viewMode]}`}>
                    {filteredRegistrations.map((reg) => (
                        <Card
                            key={reg.id}
                            id={reg.id}
                            title={reg.title}
                            description={reg.description}
                            category={reg.category}
                            status={reg.status}
                            bannerImage={reg.bannerImage}
                            viewCount={reg.viewCount}
                            submissionCount={reg.submissionCount}
                            endDate={reg.endDate}
                            hostName={reg.hostName}
                            featured={reg.featured}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Search size={48} />
                    </div>
                    <h3>No registrations found</h3>
                    <p>Try adjusting your search or filters</p>
                    <Button variant="secondary" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}

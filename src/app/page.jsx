'use client';

import { useState, useEffect, useCallback } from 'react';
import ListingCard from '@/components/ListingCard';
import { Search, Filter, Sparkles, Building2, X, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  "All",
  "Technology",
  "Healthcare",
  "Dining & Food",
  "Real Estate",
  "Finance & Legal",
  "Retail & Shopping",
  "Automotive",
  "Education",
  "Services",
];

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.set('category', selectedCategory);

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch directory listings');
      
      const data = await res.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load directory listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchListings]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 pt-16 pb-24 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Discover Verified Businesses & Services</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Find Top Companies in Your City
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light">
            Search our curated business directory by category, location, or name. Instant access to verified contact details.
          </p>

          {/* Search Bar Input */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 text-slate-800">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by business name, category, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base font-medium focus:outline-none bg-transparent placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={fetchListings}
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-600/30"
              >
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 pr-3 shrink-0">
            <Filter className="w-3.5 h-3.5 text-brand-600" />
            <span>Filter</span>
          </div>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm scale-105'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}

          {(selectedCategory !== 'All' || searchQuery !== '') && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs font-semibold text-red-600 hover:text-red-700 underline px-3 py-1 shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Listings Grid Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Results Metadata Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {selectedCategory === 'All' ? 'All Directory Listings' : `${selectedCategory} Businesses`}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {listings.length} verified company card{listings.length === 1 ? '' : 's'}
            </p>
          </div>

          <button
            onClick={fetchListings}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="h-12 bg-slate-100 rounded mb-4" />
                <div className="h-8 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Business Listings Found</h3>
            <p className="text-slate-500 text-sm mb-6">
              We couldn&apos;t find any businesses matching your search query &quot;{searchQuery}&quot; or selected category.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all"
            >
              Clear Search &amp; Filters
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

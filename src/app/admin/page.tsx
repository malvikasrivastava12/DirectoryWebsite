'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DirectoryListing } from '@/types';
import ListingFormModal from '@/components/ListingFormModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Tag, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink,
  Loader2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [listings, setListings] = useState<DirectoryListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<DirectoryListing | null>(null);
  const [deletingListing, setDeletingListing] = useState<DirectoryListing | null>(null);

  // Check auth
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        setAuthenticated(false);
        router.push('/admin/login');
      } else {
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push('/admin/login');
        }
      }
    } catch {
      setAuthenticated(false);
      router.push('/admin/login');
    }
  }, [router]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.set('category', selectedCategory);

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Fetch listings error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authenticated) {
      fetchListings();
    }
  }, [authenticated, fetchListings]);

  const handleDeleteConfirm = async () => {
    if (!deletingListing) return;
    try {
      const res = await fetch(`/api/listings/${deletingListing.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingListing(null);
        fetchListings();
      } else {
        alert('Failed to delete listing');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting listing');
    }
  };

  const handleOpenAddModal = () => {
    setEditingListing(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (listing: DirectoryListing) => {
    setEditingListing(listing);
    setIsFormOpen(true);
  };

  // Stats calculation
  const totalListings = listings.length;
  const totalCategories = new Set(listings.map(l => l.category)).size;
  const recentListings = listings.filter(l => {
    const days = (new Date().getTime() - new Date(l.createdAt).getTime()) / (1000 * 3600 * 24);
    return days <= 30;
  }).length;

  if (authenticated === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-500 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
          <span>Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Directory Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage, add, update, and remove directory business cards in real-time.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Business Listing</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Total Listings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalListings}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Published &amp; Active
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Active Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Categories</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalCategories}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Diverse business sectors</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Recent Additions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Added This Month</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{recentListings}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Recent business additions</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Toolbar Bar: Search & Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search listings by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Dining & Food">Dining &amp; Food</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Finance & Legal">Finance &amp; Legal</option>
                <option value="Retail & Shopping">Retail &amp; Shopping</option>
                <option value="Automotive">Automotive</option>
                <option value="Education">Education</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <button
              onClick={fetchListings}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">All Directory Listings</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {listings.length} Records
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
              <span>Loading listings data...</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No Listings Found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or add a new listing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                    <th className="py-3.5 px-6">Business Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                          {item.description}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs text-slate-600 font-mono">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors border border-transparent hover:border-brand-200"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingListing(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <ListingFormModal
          initialData={editingListing}
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchListings}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingListing && (
        <DeleteConfirmModal
          title="Delete Business Listing"
          listingName={deletingListing.name}
          onClose={() => setDeletingListing(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

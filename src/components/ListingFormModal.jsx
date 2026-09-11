'use client';

import { useState } from 'react';
import { X, Building2, MapPin, Phone, Tag, AlignLeft, Mail, Globe, AlertCircle, Loader2 } from 'lucide-react';

const CATEGORIES = [
  "Technology",
  "Healthcare",
  "Dining & Food",
  "Real Estate",
  "Finance & Legal",
  "Retail & Shopping",
  "Automotive",
  "Education",
  "Services",
  "Other"
];

export default function ListingFormModal({ initialData, onClose, onSuccess }) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Technology',
    location: initialData?.location || '',
    phone: initialData?.phone || '',
    description: initialData?.description || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Business name must be at least 2 characters';
    }
    if (!formData.category) {
      errs.category = 'Category is required';
    }
    if (!formData.location.trim()) {
      errs.location = 'Location is required';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7 || formData.phone.trim().length > 10) {
      errs.phone = 'Valid phone number is required (7-10 digits)';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const url = isEditing ? `/api/listings/${initialData.id}` : '/api/listings';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.error || 'Failed to save listing');
        }
      } else {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setServerError('An unexpected network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Edit Listing' : 'Add New Listing'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update business directory information' : 'Fill in business details to publish'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Apex Tech Solutions"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                  errors.name ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-brand-500'
                }`}
              />
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
          </div>

          {/* Grid: Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                    errors.category ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {errors.category && <p className="mt-1 text-xs text-red-500 font-medium">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                    errors.location ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                  }`}
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {errors.location && <p className="mt-1 text-xs text-red-500 font-medium">{errors.location}</p>}
            </div>
          </div>

          {/* Grid: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: val });
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                    errors.phone ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                  }`}
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Website URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://company.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Provide a overview of services, products, or specialty..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ${
                  errors.description ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                }`}
              />
              <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description}</p>}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-md shadow-brand-600/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Listing'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

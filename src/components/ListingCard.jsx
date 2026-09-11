'use client';

import { useState } from 'react';
import { MapPin, Phone, Tag, Star, ExternalLink, Copy, Check } from 'lucide-react';
import ListingDetailModal from './ListingDetailModal';

export default function ListingCard({ listing }) {
  const [showDetail, setShowDetail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const getCategoryColor = (cat) => {
    switch ((cat || '').toLowerCase()) {
      case 'technology':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'healthcare':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'dining & food':
      case 'dining':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'real estate':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'finance & legal':
      case 'finance':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'retail & shopping':
      case 'retail':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'automotive':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'education':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'services':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCopyPhone = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(listing.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <>
      <div 
        onClick={() => setShowDetail(true)}
        className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
      >
        {/* Subtle accent top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row: Category & Rating */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(listing.category)}`}>
              <Tag className="w-3 h-3" />
              {listing.category}
            </span>
            {listing.rating && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {Number(listing.rating).toFixed(1)}
              </span>
            )}
          </div>

          {/* Business Name */}
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-2">
            {listing.name}
          </h3>

          {/* Location Tag */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          {/* Business Description */}
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {listing.description}
          </p>
        </div>

        {/* Footer / Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
          {/* Phone call / copy badge */}
          <div className="flex items-center gap-2">
            <a 
              href={`tel:${listing.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-600" />
              <span>{listing.phone}</span>
            </a>
            <button
              onClick={handleCopyPhone}
              title="Copy Phone Number"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Quick view button */}
          <span className="text-xs font-semibold text-brand-600 group-hover:underline flex items-center gap-1">
            Details
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <ListingDetailModal listing={listing} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}

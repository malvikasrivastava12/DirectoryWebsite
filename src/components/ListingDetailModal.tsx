'use client';

import { DirectoryListing } from '@/types';
import { X, MapPin, Phone, Mail, Globe, Star, Calendar, Building2 } from 'lucide-react';

interface ListingDetailModalProps {
  listing: DirectoryListing;
  onClose: () => void;
}

export default function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top banner styling */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header content */}
        <div className="flex items-start space-x-4 mb-4 pt-2">
          <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xl shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 mb-1">
              {listing.category}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {listing.name}
            </h2>
            {listing.rating && (
              <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{listing.rating.toFixed(1)} / 5.0 Rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
          <div className="flex items-center space-x-2.5 text-sm text-slate-700">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-medium truncate">{listing.location}</span>
          </div>

          <div className="flex items-center space-x-2.5 text-sm text-slate-700">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <a href={`tel:${listing.phone}`} className="font-medium hover:underline text-brand-700">
              {listing.phone}
            </a>
          </div>

          {listing.email && (
            <div className="flex items-center space-x-2.5 text-sm text-slate-700">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <a href={`mailto:${listing.email}`} className="font-medium hover:underline text-brand-700 truncate">
                {listing.email}
              </a>
            </div>
          )}

          {listing.website && (
            <div className="flex items-center space-x-2.5 text-sm text-slate-700">
              <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
              <a 
                href={listing.website} 
                target="_blank" 
                rel="noreferrer" 
                className="font-medium hover:underline text-brand-700 truncate"
              >
                {listing.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            About Business
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
            {listing.description}
          </p>
        </div>

        {/* Footer info & action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

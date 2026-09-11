import { Building2, Globe, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-sm py-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">BizDirectory Engine</p>
              <p className="text-xs text-slate-500">Comprehensive Business Listing & Directory System</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-brand-600" /> Secure Admin Panel
            </span>
          
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} BizDirectory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

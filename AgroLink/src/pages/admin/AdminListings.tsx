import React from 'react';
import { Package, Search, Filter, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

const AdminListings: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crop Listings Moderation</h2>
                <p className="text-slate-500 font-medium text-sm">Approve or reject new crop listings to ensure quality and compliance. Only valid entries should be visible in the marketplace.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold border border-blue-100">Pending Approval (12)</button>
                    <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl font-bold">Approved (1.4k)</button>
                    <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl font-bold">Rejected (24)</button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl lg:w-96">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search by crop, farmer, or region..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="h-48 bg-slate-200 animate-pulse relative">
                            {/* Placeholder for crop image */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <Package className="w-12 h-12" />
                            </div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-900 border border-white">Wheat</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">Premium Golden Wheat</h3>
                                    <p className="text-xs text-slate-400 font-medium">Farmer: Rajesh Kumar (Punjab)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-blue-600">₹2,400</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">per Quintal</p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl mb-6 space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-500 uppercase tracking-tighter">Quantity</span>
                                    <span className="text-slate-900">500 kg</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-500 uppercase tracking-tighter">Listed On</span>
                                    <span className="text-slate-900">Today, 10:45 AM</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-600/20">
                                    <CheckCircle2 className="w-4 h-4" />
                                    APPROVE
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 rounded-xl text-xs font-black transition-all">
                                    <XCircle className="w-4 h-4" />
                                    REJECT
                                </button>
                                <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminListings;

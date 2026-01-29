import React from 'react';
import { Construction } from 'lucide-react';

interface AdminPlaceholderProps {
    title: string;
}

const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm animate-bounce">
                <Construction className="w-10 h-10 text-amber-600" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto mt-2">
                    This enterprise module is currently under active development. Our AI systems are preparing the data structures for this section.
                </p>
            </div>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                Check Status Again
            </button>
        </div>
    );
};

export default AdminPlaceholder;

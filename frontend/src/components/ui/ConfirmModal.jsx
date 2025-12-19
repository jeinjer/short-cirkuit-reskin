import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-60 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200" onClick={onCancel}>
            <div className="bg-[#13131a] border border-red-500/30 rounded-2xl w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(239,68,68,0.2)]" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">¿Estás seguro?</h3>
                    <p className="text-gray-400 mb-6">{message}</p>
                    
                    <div className="flex w-full gap-3">
                        <button 
                            onClick={onCancel} 
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 font-semibold cursor-pointer transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={onConfirm} 
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 font-bold shadow-lg shadow-red-900/20 cursor-pointer transition-all active:scale-95"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
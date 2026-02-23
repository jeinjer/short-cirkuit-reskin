import React from 'react';
import { MessageSquare, Package, ReceiptText } from 'lucide-react';

const TAB_ITEMS = [
  { key: 'products', label: 'Productos', Icon: Package },
  { key: 'inquiries', label: 'Consultas', Icon: MessageSquare },
  { key: 'orders', label: 'Órdenes', Icon: ReceiptText }
];

export default function AdminDashboardTabs({ activeTab, onSelectTab }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 border-b border-white/5 pb-2">
      {TAB_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelectTab(item.key)}
          className={`flex items-center justify-center gap-2 px-4 py-3 font-cyber text-xs sm:text-sm tracking-widest uppercase transition-all relative rounded-lg border ${
            activeTab === item.key ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <item.Icon size={18} />
          {item.label}
          {activeTab === item.key && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
          )}
        </button>
      ))}
    </div>
  );
}

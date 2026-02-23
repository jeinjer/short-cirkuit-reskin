import React from 'react';
import { PanelsTopLeft } from 'lucide-react';
import { PROFILE_TABS } from './profile.constants';

const TAB_ITEMS = [
  { key: PROFILE_TABS.ACCOUNT, label: 'Mi cuenta' },
  { key: PROFILE_TABS.ORDERS, label: 'Mis pedidos' },
  { key: PROFILE_TABS.INQUIRIES, label: 'Mis consultas' }
];

export default function ProfileTabsNav({ tab, onSelectTab }) {
  return (
    <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-cyan-300 font-bold mb-3">
        <PanelsTopLeft size={16} />
        Secciones
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TAB_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelectTab(item.key)}
            className={`h-11 rounded-lg border text-sm font-bold transition-colors cursor-pointer ${
              tab === item.key
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}

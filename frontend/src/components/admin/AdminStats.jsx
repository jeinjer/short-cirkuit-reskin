import React from 'react';
import { Package, Users, DollarSign } from 'lucide-react';

export default function AdminStats({ stats, dolarValue }) {
  return (
    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <MetricCard icon={<Users/>} label="Usuarios" value={stats.users} color="text-blue-400"/>
        <MetricCard icon={<Package/>} label="Productos" value={stats.products} color="text-purple-400"/>
        <MetricCard icon={<DollarSign/>} label="Dólar Blue" value={`$${dolarValue}`} color="text-green-400"/>
    </div>
  );
}

const MetricCard = ({ icon, label, value, color }) => (
    <div className="bg-[#13131a] p-4 rounded-xl border border-white/5 min-w-[140px] flex-1">
        <div className={`flex items-center gap-2 mb-2 ${color}`}>
            {React.cloneElement(icon, { size: 18 })}
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);
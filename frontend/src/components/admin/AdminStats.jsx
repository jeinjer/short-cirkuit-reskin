import React from 'react';
import { Package, Users, DollarSign, AlertTriangle } from 'lucide-react';

export default function AdminStats({ stats, dolarValue }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      <MetricCard icon={<Users />} label="Usuarios" value={stats.users} tone="cyan" />
      <MetricCard icon={<Package />} label="Productos" value={stats.products} tone="violet" />
      <MetricCard icon={<AlertTriangle />} label="Sin Stock" value={stats.sinStock} tone="amber" />
      <MetricCard icon={<DollarSign />} label="Dólar" value={`$${dolarValue}`} tone="emerald" />
    </div>
  );
}

const toneStyles = {
  cyan: {
    icon: 'text-cyan-300',
    glow: 'from-cyan-500/20'
  },
  violet: {
    icon: 'text-violet-300',
    glow: 'from-violet-500/20'
  },
  amber: {
    icon: 'text-amber-300',
    glow: 'from-amber-500/20'
  },
  emerald: {
    icon: 'text-emerald-300',
    glow: 'from-emerald-500/20'
  }
};

const MetricCard = ({ icon, label, value, tone = 'cyan' }) => {
  const t = toneStyles[tone] || toneStyles.cyan;

  return (
    <div className="relative overflow-hidden bg-[#0f1117] p-4 rounded-xl border border-cyan-500/20 min-h-[92px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${t.glow} to-transparent pointer-events-none`} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:2.2rem_2.2rem] opacity-20 pointer-events-none" />

      <div className={`relative flex items-center gap-2 mb-2 ${t.icon}`}>
        {React.cloneElement(icon, { size: 16 })}
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      </div>

      <p className="relative text-2xl font-black text-white leading-none">{value}</p>
    </div>
  );
};

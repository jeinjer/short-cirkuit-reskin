import React from 'react';
import { Check, X } from 'lucide-react';

function RuleRow({ rule, small = false }) {
  const size = small ? 10 : 10;
  return (
    <div
      className={`flex items-center gap-1.5 ${small ? 'text-[10px]' : 'text-[10px] sm:text-[11px]'} ${
        rule.valid ? 'text-cyan-300' : 'text-red-400'
      }`}
    >
      {rule.valid ? <Check size={size} /> : <X size={size} />}
      <span className={rule.valid ? 'font-bold' : ''}>{rule.label}</span>
    </div>
  );
}

export default function PasswordRulesChecklist({
  password,
  typeValidations,
  lengthValidations,
  compact = false
}) {
  if (!password?.length) return null;

  return (
    <div
      className={`bg-black/30 p-2.5 rounded-lg border border-white/8 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 ${
        compact ? 'mt-1' : ''
      }`}
    >
      <div className="space-y-0.5">
        {typeValidations.map((rule, index) => (
          <RuleRow key={`${rule.label}-${index}`} rule={rule} small={compact} />
        ))}
      </div>

      <div className="space-y-0.5 border-l border-white/10 pl-3">
        {lengthValidations.map((rule, index) => (
          <RuleRow key={`${rule.label}-${index}`} rule={rule} small={compact} />
        ))}
      </div>
    </div>
  );
}

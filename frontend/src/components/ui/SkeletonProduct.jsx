import React from 'react';

export default function SkeletonProduct() {
  return (
    <div className="bg-[#13131a] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="h-56 bg-white/5 w-full"></div>
    
      <div className="p-5 flex-1 flex flex-col space-y-3">
        <div className="flex justify-between">
            <div className="h-3 bg-white/5 rounded w-1/3"></div>
            <div className="h-3 bg-white/5 rounded w-1/4"></div>
        </div>

        <div className="h-5 bg-white/10 rounded w-full"></div>
        <div className="h-5 bg-white/10 rounded w-2/3"></div>

        <div className="flex gap-2 mt-2">
            <div className="h-6 w-16 bg-white/5 rounded"></div>
            <div className="h-6 w-16 bg-white/5 rounded"></div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-10"></div>
                <div className="h-6 bg-white/10 rounded w-24"></div>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
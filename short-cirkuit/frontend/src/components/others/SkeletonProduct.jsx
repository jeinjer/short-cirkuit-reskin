import React from 'react';

export default function SkeletonProduct({ viewMode = 'grid' }) {
  const isGrid = viewMode === 'grid';

  if (isGrid) {
    return (
      <div className="bg-[#13131a] rounded-xl border border-white/5 overflow-hidden flex flex-col h-full animate-pulse">
        <div className="h-48 bg-white/5 w-full"></div>
        <div className="p-4 flex-1 flex flex-col space-y-3">
          <div className="h-2 bg-white/5 rounded w-1/3"></div>
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-2/3"></div>
          <div className="mt-auto pt-3 border-t border-white/5">
              <div className="h-2 bg-white/5 rounded w-8 mb-2"></div>
              <div className="h-6 bg-white/10 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#13131a] rounded-xl border border-white/5 overflow-hidden flex flex-row h-32 md:h-40 animate-pulse">
        <div className="w-32 md:w-48 bg-white/5 h-full shrink-0"></div>
        <div className="p-4 flex-1 flex flex-col justify-center gap-3">
            <div className="space-y-2">
                <div className="h-2 bg-white/5 rounded w-24"></div>
                <div className="h-5 bg-white/10 rounded w-1/2"></div>
            </div>
            <div>
                 <div className="h-2 bg-white/5 rounded w-10 mb-1"></div>
                 <div className="h-6 bg-white/10 rounded w-24"></div>
            </div>
        </div>
    </div>
  );
}
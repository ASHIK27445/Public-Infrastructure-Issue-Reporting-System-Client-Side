// AllIssuesSkeleton.jsx
import React from 'react';

const AllIssuesSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-linear-to-r from-emerald-900/30 to-teal-900/30 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="h-16 w-64 bg-zinc-700 rounded-2xl mb-4"></div>
          <div className="h-6 w-96 bg-zinc-700 rounded-xl mb-6"></div>
          <div className="flex flex-wrap items-center gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-zinc-700 rounded-full"></div>
                <div className="h-4 w-28 bg-zinc-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters Skeleton */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-row gap-4">
            <div className="flex-1 relative">
              <div className="w-full h-14 bg-zinc-800 border border-zinc-700 rounded-2xl"></div>
            </div>
            <div className="w-28 h-14 bg-zinc-800 border border-zinc-700 rounded-2xl"></div>
            <div className="w-28 h-14 bg-zinc-800 border border-zinc-700 rounded-2xl"></div>
          </div>
        </div>
      </div>

      {/* Results Count Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-zinc-700 rounded"></div>
          <div className="h-5 w-32 bg-zinc-700 rounded"></div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-fr">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden border border-zinc-700 h-full flex flex-col">
              {/* Image skeleton */}
              <div className="relative h-48 overflow-hidden shrink-0 bg-zinc-700">
                <div className="absolute top-2 md:top-4 right-4 px-2 md:px-4 py-2 bg-zinc-600 rounded-full w-24 h-8"></div>
                <div className="absolute top-2 md:top-4 left-4 px-2 md:px-4 py-2 bg-zinc-600 rounded-full w-20 h-8"></div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Category skeleton */}
                <div className="mb-3">
                  <div className="px-3 py-1 bg-zinc-700 rounded-full w-20 h-6"></div>
                </div>

                {/* Title skeleton */}
                <div className="flex flex-col grow">
                  <div className="h-6 bg-zinc-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-zinc-700 rounded w-1/2"></div>
                </div>

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-zinc-700 rounded w-full"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                </div>

                {/* Location & Date skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-zinc-700 rounded"></div>
                    <div className="h-4 bg-zinc-700 rounded w-20"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-zinc-700 rounded"></div>
                    <div className="h-4 bg-zinc-700 rounded w-16"></div>
                  </div>
                </div>

                {/* Reporter skeleton */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-zinc-700"></div>
                  <div className="h-4 bg-zinc-700 rounded w-24"></div>
                </div>

                {/* Actions skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-700 mt-auto">
                  <div className="h-9 w-20 bg-zinc-700 rounded-xl"></div>
                  <div className="h-9 w-24 bg-zinc-700 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2 mt-7 pb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-4 py-2 bg-zinc-700 rounded-xl w-10 h-10"></div>
        ))}
      </div>
    </div>
  );
};

export default AllIssuesSkeleton;

import React from 'react';

const EventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 animate-pulse">
      <div className="max-w-360 mx-auto">
        {/* Back button skeleton */}
        <div className="flex items-center gap-1.5 mb-6">
          <div className="w-4 h-4 bg-zinc-700 rounded"></div>
          <div className="h-4 w-32 bg-zinc-700 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero card skeleton */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="h-56 md:h-72 bg-zinc-700"></div>
              <div className="p-6 md:p-8">
                {/* Badges skeleton */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="h-7 w-32 bg-zinc-700 rounded-full"></div>
                  <div className="h-7 w-40 bg-zinc-700 rounded-full"></div>
                </div>

                {/* Title skeleton */}
                <div className="h-8 w-3/4 bg-zinc-700 rounded-lg mb-4"></div>

                {/* Info chips skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 bg-zinc-800 border border-zinc-700 rounded-lg p-3.5">
                      <div className="w-5 h-5 bg-zinc-600 rounded"></div>
                      <div className="flex-1">
                        <div className="h-3 w-16 bg-zinc-600 rounded mb-1"></div>
                        <div className="h-4 w-32 bg-zinc-600 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Announcement skeleton */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-5">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-zinc-600 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 w-32 bg-zinc-600 rounded mb-1"></div>
                      <div className="h-4 w-full bg-zinc-600 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Reaction bar skeleton */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-9 w-28 bg-zinc-700 rounded-full"></div>
                  ))}
                  <div className="h-4 w-48 bg-zinc-700 rounded ml-auto"></div>
                </div>
              </div>
            </div>

            {/* Tabs skeleton */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="flex border-b border-zinc-700 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="px-5 py-3.5">
                    <div className="h-5 w-20 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="h-4 w-32 bg-zinc-700 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-zinc-700 rounded"></div>
                      <div className="h-4 w-5/6 bg-zinc-700 rounded"></div>
                      <div className="h-4 w-4/6 bg-zinc-700 rounded"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-4 w-40 bg-zinc-700 rounded mb-3"></div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 w-24 bg-zinc-700 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Join card skeleton */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <div className="h-6 w-32 bg-zinc-700 rounded mb-1"></div>
              <div className="h-4 w-48 bg-zinc-700 rounded mb-4"></div>
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <div className="h-3 w-16 bg-zinc-700 rounded"></div>
                  <div className="h-3 w-16 bg-zinc-700 rounded"></div>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full"></div>
              </div>
              <div className="h-11 w-full bg-zinc-700 rounded-lg"></div>
            </div>

            {/* Support card skeleton */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-zinc-700 rounded"></div>
                <div className="h-5 w-40 bg-zinc-700 rounded"></div>
              </div>
              <div className="h-4 w-full bg-zinc-700 rounded mb-4"></div>
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <div className="h-3 w-24 bg-zinc-700 rounded"></div>
                  <div className="h-3 w-8 bg-zinc-700 rounded"></div>
                </div>
                <div className="h-2.5 bg-zinc-700 rounded-full"></div>
                <div className="h-3 w-32 bg-zinc-700 rounded mt-1.5"></div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-9 bg-zinc-700 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-11 w-full bg-zinc-700 rounded-lg"></div>
                <div className="h-11 w-full bg-zinc-700 rounded-lg"></div>
              </div>
            </div>

            {/* Stats card skeleton */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <div className="h-4 w-24 bg-zinc-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-zinc-700 rounded"></div>
                      <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                    </div>
                    <div className="h-4 w-12 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share card skeleton */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5">
              <div className="h-4 w-24 bg-zinc-700 rounded mb-3"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-zinc-700 rounded-lg"></div>
                <div className="flex-1 h-10 bg-zinc-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSkeleton;
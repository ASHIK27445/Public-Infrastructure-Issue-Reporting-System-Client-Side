import React from 'react';

const CitizenDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 animate-pulse">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="h-10 w-64 bg-zinc-700 rounded-lg mb-2"></div>
              <div className="h-5 w-72 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-40 bg-zinc-700 rounded-2xl"></div>
              <div className="h-10 w-10 bg-zinc-700 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-2xl"></div>
                <div className="w-16 h-6 bg-zinc-700 rounded-full"></div>
              </div>
              <div className="h-8 w-20 bg-zinc-700 rounded mb-2"></div>
              <div className="h-4 w-24 bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Issues Over Time Chart Skeleton */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-7 w-48 bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-56 bg-zinc-700 rounded"></div>
              </div>
              <div className="w-6 h-6 bg-zinc-700 rounded"></div>
            </div>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full h-64 bg-zinc-700/30 rounded-lg flex items-end justify-around px-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-8">
                    <div 
                      className="w-6 bg-zinc-700 rounded-t" 
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    ></div>
                    <div className="w-6 bg-zinc-700/50 rounded-t" 
                      style={{ height: `${Math.random() * 40 + 10}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Distribution Chart Skeleton */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-7 w-48 bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-56 bg-zinc-700 rounded"></div>
              </div>
              <div className="w-6 h-6 bg-zinc-700 rounded"></div>
            </div>
            <div className="h-80 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-zinc-700 relative">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-16 h-16 rounded-full bg-zinc-700"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts Row Skeleton */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Priority Distribution Skeleton */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-7 w-48 bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-56 bg-zinc-700 rounded"></div>
              </div>
              <div className="w-6 h-6 bg-zinc-700 rounded"></div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-48 flex items-end justify-around px-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full">
                    <div 
                      className="w-12 bg-zinc-700 rounded-t" 
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    ></div>
                    <div className="h-4 w-12 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resolution Time Skeleton */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-7 w-48 bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-56 bg-zinc-700 rounded"></div>
              </div>
              <div className="w-6 h-6 bg-zinc-700 rounded"></div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-48 flex items-end justify-around px-4 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full">
                    <div 
                      className="w-8 bg-zinc-700 rounded-t" 
                      style={{ height: `${Math.random() * 50 + 10}%` }}
                    ></div>
                    <div className="w-8 h-3 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Issues Table Skeleton */}
        <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden mb-8">
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-7 w-40 bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-56 bg-zinc-700 rounded"></div>
              </div>
              <div className="h-6 w-24 bg-zinc-700 rounded"></div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  {[...Array(7)].map((_, i) => (
                    <th key={i} className="py-2 px-2">
                      <div className="h-4 w-16 bg-zinc-700 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, index) => (
                  <tr key={index} className="border-b border-zinc-700">
                    <td className="py-2 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-zinc-700 rounded-xl"></div>
                        <div>
                          <div className="h-4 w-32 bg-zinc-700 rounded mb-1"></div>
                          <div className="h-3 w-24 bg-zinc-700 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-16 bg-zinc-700 rounded"></div>
                        <div className="h-4 w-16 bg-zinc-700 rounded"></div>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="h-5 w-20 bg-zinc-700 rounded-full"></div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="h-6 w-24 bg-zinc-700 rounded-full"></div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="h-5 w-16 bg-zinc-700 rounded-full"></div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="w-8 h-8 bg-zinc-700 rounded-lg"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="h-4 w-48 bg-zinc-700 rounded"></div>
              <div className="h-10 w-40 bg-zinc-700 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Achievements & Insights Skeleton */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Achievements Skeleton */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="h-7 w-48 bg-zinc-700 rounded mb-6"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="p-4 rounded-2xl border border-zinc-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-9 h-9 bg-zinc-700 rounded-xl"></div>
                    <div className="h-4 w-24 bg-zinc-700 rounded"></div>
                  </div>
                  <div className="h-3 w-20 bg-zinc-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights Skeleton */}
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
            <div className="h-7 w-48 bg-zinc-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-zinc-700 rounded"></div>
                    <div>
                      <div className="h-4 w-32 bg-zinc-700 rounded mb-1"></div>
                      <div className="h-3 w-24 bg-zinc-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-7 w-16 bg-zinc-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboardSkeleton;
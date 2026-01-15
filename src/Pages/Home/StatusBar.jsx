import React from 'react';

const StatsBar = () => {
  const stats = [
    { value: "24,891", label: "Issues Resolved", color: "from-emerald-500 to-teal-500" },
    { value: "16,432", label: "Active Citizens", color: "from-teal-500 to-cyan-500" },
    { value: "98.5%", label: "Success Rate", color: "from-green-500 to-emerald-500" },
    { value: "18hrs", label: "Avg Response", color: "from-cyan-500 to-blue-500" }
  ];

  return (
    <section className="relative mt-24 z-30 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden rounded-3xl bg-linear-to-br from-zinc-900 to-zinc-800 p-8 border border-zinc-700 hover:border-emerald-500/50 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className={`text-5xl md:text-6xl font-black bg-linear-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
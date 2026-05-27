export default function MetricsBar({ label, value = 0, color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'bg-slate-400', light: 'bg-slate-800' },
    purple: { bg: 'bg-zinc-400', light: 'bg-zinc-800' },
    cyan: { bg: 'bg-slate-300', light: 'bg-slate-800' },
    green: { bg: 'bg-emerald-400', light: 'bg-slate-800' },
    red: { bg: 'bg-stone-400', light: 'bg-slate-800' },
  };

  const { bg, light } = colorMap[color] || colorMap.blue;
  const percentage = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between text-slate-200 transition-colors duration-300">
        <label className="text-sm font-semibold text-slate-300">
          {label}
        </label>
        <span className="text-lg font-semibold text-slate-100 transition-colors duration-300">
          {percentage}%
        </span>
      </div>

      <div className={`w-full h-3 rounded-full ${light} border border-slate-700 overflow-hidden transition-colors duration-300`}>
        <div
          className={`h-full ${bg} rounded-full transition-all duration-700 ease-out relative`}
          style={{
            width: `${percentage}%`,
          }}
        >
        </div>
      </div>
    </div>
  );
}

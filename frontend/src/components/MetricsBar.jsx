// Barra de métrica de IA com animação de preenchimento
export default function MetricsBar({ label, value, color = 'blue' }) {
  // Mapeamento de cores
  const colorMap = {
    blue: { bg: 'bg-blue-500', light: 'bg-blue-400/30' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-400/30' },
    cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-400/30' },
    green: { bg: 'bg-green-500', light: 'bg-green-400/30' },
    red: { bg: 'bg-red-500', light: 'bg-red-400/30' },
  };

  const { bg, light } = colorMap[color] || colorMap.blue;
  const percentage = Math.round(value * 100);

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-center group-hover:text-slate-100 transition-colors duration-300">
        <label className="text-sm font-semibold text-slate-300">
          {label}
        </label>
        <span className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
          {percentage}%
        </span>
      </div>
      
      {/* Barra de progresso com glassmorphism */}
      <div className={`w-full h-3 rounded-full ${light} backdrop-blur-lg border border-white/20 overflow-hidden shadow-lg transition-all duration-300 group-hover:border-white/40`}>
        <div
          className={`h-full ${bg} rounded-full transition-all duration-700 ease-out shadow-lg relative`}
          style={{
            width: `${percentage}%`,
            boxShadow: `0 0 20px ${color === 'blue' ? '#3b82f6' : color === 'purple' ? '#a855f7' : color === 'cyan' ? '#06b6d4' : color === 'green' ? '#22c55e' : '#ef4444'}, inset 0 0 10px rgba(255, 255, 255, 0.3)`,
          }}
        >
          {/* Efeito de shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

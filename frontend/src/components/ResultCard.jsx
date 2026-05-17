// Componente que exibe o resultado da análise
export default function ResultCard({ result, onAnalyzeAnother }) {
  if (!result) return null;

  const isTrue = result.resultado === 'Provavelmente Verdadeiro';
  
  // Consolidate color configuration
  const statusConfig = {
    colors: isTrue 
      ? { bg: 'bg-green-900', border: 'border-green-700', text: 'text-green-400', badge: 'bg-green-800' }
      : { bg: 'bg-red-900', border: 'border-red-700', text: 'text-red-400', badge: 'bg-red-800' },
    icon: isTrue ? '✓' : '⚠️',
    confidenceColor: isTrue ? 'bg-green-600' : 'bg-red-600',
  };

  const confiancaPercentual = Math.round(result.confianca * 100);

  return (
    <div className="animate-fadeIn">
      <div className={`${statusConfig.colors.bg} ${statusConfig.colors.border} border rounded-xl p-8 shadow-lg`}>
        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${statusConfig.colors.text} ${statusConfig.colors.badge}`}>
            {statusConfig.icon}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${statusConfig.colors.text}`}>
              {result.resultado}
            </h2>
            <p className="text-slate-300 text-sm">Resultado da análise</p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-8 bg-slate-900 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">Nível de Confiança</span>
            <span className="text-2xl font-bold text-blue-400">{confiancaPercentual}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${statusConfig.confidenceColor}`}
              style={{ width: `${confiancaPercentual}%` }}
            ></div>
          </div>
        </div>

        {/* Indicador/Motivo */}
        <div className="mb-6 bg-slate-900 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-2">📊 Análise Detalhada</h3>
          <p className="text-slate-300 leading-relaxed">
            {result.motivo}
          </p>
        </div>

        {/* Button to analyze another */}
        <button
          onClick={onAnalyzeAnother}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          🔄 Analisar Outro Texto
        </button>
      </div>
    </div>
  );
}

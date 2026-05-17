// Componente que exibe o resultado da análise
export default function ResultCard({ result, onAnalyzeAnother }) {
  if (!result) return null;

  const isTrue = result.resultado === 'Provavelmente Verdadeiro';
  const statusColor = isTrue ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700';
  const statusTextColor = isTrue ? 'text-green-400' : 'text-red-400';
  const statusIcon = isTrue ? '✓' : '⚠️';
  const confidenceColor = isTrue ? 'bg-green-600' : 'bg-red-600';

  const confiancaPercentual = Math.round(result.confianca * 100);

  return (
    <div className="animate-fadeIn">
      <div className={`${statusColor} border rounded-xl p-8 shadow-lg`}>
        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${statusTextColor} ${isTrue ? 'bg-green-800' : 'bg-red-800'}`}>
            {statusIcon}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${statusTextColor}`}>
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
              className={`h-full transition-all duration-300 ${confidenceColor}`}
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

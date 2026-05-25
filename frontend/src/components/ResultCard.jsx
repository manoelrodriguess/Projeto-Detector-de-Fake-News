// Card que exibe o resultado da análise com classificação e indicadores
export default function ResultCard({ result, onAnalyzeAnother }) {
  if (!result) return null;

  const isTrue = result.classification === 'true';
  const confidence = Math.round(result.confidence * 100);

  return (
    <div className="w-full animate-fadeIn">
      {/* Card principal */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
        
        {/* Header com classificação */}
        <div
          className={`px-6 py-4 border-b-2 ${
            isTrue
              ? 'bg-green-900/20 border-green-500/50'
              : 'bg-red-900/20 border-red-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                RESULTADO DA ANÁLISE
              </p>
              <h2
                className={`text-3xl font-bold ${
                  isTrue ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isTrue ? '✅ VERDADEIRO' : '⚠️ SUSPEITO'}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm mb-1">Confiança</p>
              <div className="text-4xl font-bold text-blue-400">
                {confidence}%
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso de confiança */}
        <div className="px-6 py-3 bg-slate-900">
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isTrue ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Indicadores */}
        {result.indicators && result.indicators.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-700">
            <p className="text-slate-300 font-semibold mb-3">
              📊 Principais Indicadores:
            </p>
            <ul className="space-y-2">
              {result.indicators.map((indicator, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-slate-300 text-sm"
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                      isTrue
                        ? 'bg-green-900/40 text-green-400'
                        : 'bg-red-900/40 text-red-400'
                    }`}
                  >
                    •
                  </span>
                  <span>{indicator}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer com botão de ação */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-700 flex gap-3">
          <button
            onClick={onAnalyzeAnother}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200"
          >
            🔄 Analisar Outro Texto
          </button>
          
          {/* Botão auxiliar para copiar resultado (bônus) */}
          <button
            onClick={() => {
              const resultText = `Classificação: ${isTrue ? 'VERDADEIRO' : 'SUSPEITO'}\nConfiança: ${confidence}%`;
              navigator.clipboard.writeText(resultText);
              alert('Resultado copiado para a área de transferência!');
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-md transition-colors duration-200"
            title="Copiar resultado"
          >
            📋
          </button>
        </div>
      </div>

      {/* Informação adicional */}
      <p className="text-slate-500 text-xs mt-4 text-center">
        ℹ️ Esta análise é fornecida por IA e deve ser validada com fontes de confiança
      </p>
    </div>
  );
}

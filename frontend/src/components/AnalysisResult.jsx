import MetricsBar from './MetricsBar';
import HighlightedText from './HighlightedText';

// Dashboard de resultados com análise completa da IA
export default function AnalysisResult({ result, originalText, onAnalyzeAnother }) {
  if (!result) return null;

  const isTrue = result.classification === 'true';
  const confidence = Math.round(result.confidence * 100);

  // Dados simulados de métricas da IA (em produção viriam do backend)
  const metrics = {
    timeliness: isTrue ? 0.92 : 0.45,      // Atualização
    clarity: isTrue ? 0.87 : 0.62,         // Clareza
    accuracy: isTrue ? 0.95 : 0.38,        // Precisão
    reliability: isTrue ? 0.89 : 0.51,     // Confiabilidade
  };

  // Termos destacados simulados
  const highlightedTerms = [
    { word: 'análise', type: 'relevant' },
    { word: 'suspeito', type: 'suspicious' },
    { word: 'verificação', type: 'relevant' },
  ];

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Cartão Principal com Resultado */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl hover:shadow-2xl hover:border-slate-600/80 transition-all duration-300">
        
        {/* Header do Resultado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Indicador Principal */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
              Classificação
            </p>
            
            <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-2xl border-2 w-fit transition-all duration-300 hover:scale-105 ${
              isTrue
                ? 'bg-green-500/15 border-green-500/60 shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
                : 'bg-red-500/15 border-red-500/60 shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
            }`}>
              <span className="text-5xl animate-bounce">
                {isTrue ? '✅' : '⚠️'}
              </span>
              <div>
                <h2 className={`text-3xl font-bold leading-none ${
                  isTrue ? 'text-green-300' : 'text-red-300'
                }`}>
                  {isTrue ? 'Verdadeiro' : 'Falso'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isTrue ? 'Confiança alta' : 'Risco detectado'}
                </p>
              </div>
            </div>
          </div>

          {/* Confiança em Grande */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
              Confiabilidade
            </p>
            
            <div className="relative w-40 h-40 mx-auto hover:scale-110 transition-transform duration-300">
              {/* Círculo de progresso radial com CSS */}
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg" viewBox="0 0 160 160">
                {/* Fundo do círculo */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                  opacity="0.3"
                />
                {/* Círculo preenchido */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={isTrue ? '#22c55e' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(confidence / 100) * 439.8} 439.8`}
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                  style={{
                    filter: isTrue
                      ? 'drop-shadow(0 0 25px rgba(34, 197, 94, 0.7))'
                      : 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.7))',
                  }}
                />
              </svg>
              
              {/* Texto no centro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {confidence}%
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Confiança
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador com gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/80 to-transparent mb-8" />

        {/* Seção de Métricas */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">
            📊 Métricas de Análise da IA
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MetricsBar
              label="Atualização"
              value={metrics.timeliness}
              color={isTrue ? 'green' : 'red'}
            />
            <MetricsBar
              label="Clareza"
              value={metrics.clarity}
              color={isTrue ? 'cyan' : 'yellow'}
            />
            <MetricsBar
              label="Precisão"
              value={metrics.accuracy}
              color={isTrue ? 'green' : 'red'}
            />
            <MetricsBar
              label="Confiabilidade"
              value={metrics.reliability}
              color={isTrue ? 'cyan' : 'purple'}
            />
          </div>
        </div>
      </div>

      {/* Indicadores Principais */}
      {result.indicators && result.indicators.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600/80 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-4">
            🔍 Indicadores Detectados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.indicators.map((indicator, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-600/40 hover:border-slate-500/70 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <span className="text-xl mt-0.5 text-2xl">
                  {isTrue ? '✓' : '✗'}
                </span>
                <span className="text-slate-300 text-sm font-medium">
                  {indicator}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Texto com Highlights */}
      <HighlightedText
        text={originalText}
        highlightedTerms={highlightedTerms}
      />

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onAnalyzeAnother}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 hover:from-blue-600 hover:via-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm border border-blue-400/50 hover:border-blue-300/80"
        >
          🔄 Analisar Outro Texto
        </button>
        
        <button
          onClick={() => {
            const report = `RELATÓRIO DE ANÁLISE\n\nClassificação: ${isTrue ? 'Verdadeiro' : 'Falso'}\nConfiança: ${confidence}%\n\nMétricas:\n- Atualização: ${Math.round(metrics.timeliness * 100)}%\n- Clareza: ${Math.round(metrics.clarity * 100)}%\n- Precisão: ${Math.round(metrics.accuracy * 100)}%\n- Confiabilidade: ${Math.round(metrics.reliability * 100)}%`;
            navigator.clipboard.writeText(report);
            alert('Relatório copiado para a área de transferência!');
          }}
          className="px-6 py-3 bg-gradient-to-r from-slate-700/60 to-slate-700/40 hover:from-slate-600/80 hover:to-slate-600/60 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-600/60 hover:border-slate-500/80 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-slate-700/30 hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          📋 Copiar Relatório
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gradient-to-r from-slate-900/40 to-slate-800/40 backdrop-blur-lg border border-slate-700/60 rounded-xl hover:border-slate-600/80 transition-all duration-300">
        <p className="text-xs text-slate-400 leading-relaxed hover:text-slate-300 transition-colors duration-300">
          <span className="font-semibold">ℹ️ Informação Importante:</span> Esta análise é fornecida por IA e deve ser validada com fontes de confiança. Resultados são baseados em padrões estatísticos e podem estar sujeitos a limitações e erros.
        </p>
      </div>
    </div>
  );
}

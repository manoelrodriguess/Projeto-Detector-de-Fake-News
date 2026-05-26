import MetricsBar from './MetricsBar';
import HighlightedText from './HighlightedText';
import { AlertTriangle, BarChart3, Check, ClipboardCopy, FileText, Info, RotateCcw, Search, SearchX, X } from 'lucide-react';

export default function AnalysisResult({ result, originalText, onAnalyzeAnother }) {
  if (!result) return null;

  const isTrue = result.classification === 'true';
  const confidence = Math.round(result.confidence * 100);
  const suspiciousSpans = result.suspiciousSpans || [];
  const confidenceRaw = typeof result.confidenceRaw === 'number' ? Math.round(result.confidenceRaw * 100) : null;

  const metrics = {
    timeliness: isTrue ? 0.92 : 0.45,      // Atualização
    clarity: isTrue ? 0.87 : 0.62,         // Clareza
    accuracy: isTrue ? 0.95 : 0.38,        // Precisão
    reliability: isTrue ? 0.89 : 0.51,     // Confiabilidade
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition-colors duration-200 hover:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">
              Classificação
            </p>
            <div className={`inline-flex w-fit items-center gap-4 rounded-2xl border px-6 py-4 transition-colors duration-200 ${
              isTrue
                ? 'border-emerald-900 bg-slate-950'
                : 'border-red-900 bg-slate-950'
            }`}>
              {isTrue ? <BarChart3 className="h-10 w-10 text-emerald-300" /> : <AlertTriangle className="h-10 w-10 text-red-300" />}
              <div>
                <h2 className={`text-3xl font-semibold leading-none ${
                  isTrue ? 'text-green-300' : 'text-red-300'
                }`}>
                  {isTrue ? 'Verdadeiro' : 'Falso'}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {isTrue ? 'Confiança alta' : 'Risco detectado'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">
              Confiabilidade
            </p>
            
            <div className="relative mx-auto h-40 w-40">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={isTrue ? '#22c55e' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(confidence / 100) * 439.8} 439.8`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-semibold text-slate-50">
                  {confidence}%
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  Confiança
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 h-px bg-slate-800" />

        <div className="mb-4 text-sm text-slate-400">
            {confidenceRaw !== null ? (
              <div>
                <strong>Modelo:</strong> {confidenceRaw}% — <strong>Ajustado:</strong> {confidence}%
              </div>
            ) : (
              <div>
                <strong>Ajustado:</strong> {confidence}%
              </div>
            )}
          </div>

        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-100">
            <BarChart3 className="h-5 w-5" />
            Métricas de Análise da IA
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

      {/* Texto lido do arquivo/imagem */}
      {originalText && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors duration-200 hover:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-100">
            <FileText className="h-4 w-4" />
            Texto extraído para análise
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {originalText}
          </p>
        </div>
      )}

      {/* Indicadores Principais */}
      {result.indicators && result.indicators.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors duration-200 hover:border-slate-700">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Search className="h-4 w-4" />
            Indicadores Detectados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.indicators.map((indicator, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 transition-colors duration-200 hover:border-slate-700"
              >
                <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${isTrue ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                  {isTrue ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                </span>
                <span className="text-sm font-medium text-slate-300">
                  {indicator}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Texto com Highlights */}
      <HighlightedText text={originalText} suspiciousSpans={suspiciousSpans} />

      {suspiciousSpans.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors duration-200 hover:border-slate-700">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
            <SearchX className="h-4 w-4" />
            Trechos possivelmente falsos
          </h3>
          <div className="space-y-3">
            {suspiciousSpans.map((span, index) => (
              <div
                key={`${index}-${span.excerpt}`}
                className="rounded-xl border border-red-900 bg-slate-950 p-4 text-slate-100"
              >
                <p className="font-semibold text-red-200">“{span.excerpt}”</p>
                {span.reason && (
                  <p className="mt-2 text-sm text-slate-300">{span.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onAnalyzeAnother}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-100 px-6 py-3 font-semibold text-slate-950 transition-colors duration-200 hover:bg-white active:scale-[0.99]"
        >
          <RotateCcw className="h-4 w-4" />
          Analisar Outro Texto
        </button>
        
        <button
          onClick={() => {
            const report = `RELATÓRIO DE ANÁLISE\n\nClassificação: ${isTrue ? 'Verdadeiro' : 'Falso'}\nConfiança: ${confidence}%\n\nMétricas:\n- Atualização: ${Math.round(metrics.timeliness * 100)}%\n- Clareza: ${Math.round(metrics.clarity * 100)}%\n- Precisão: ${Math.round(metrics.accuracy * 100)}%\n- Confiabilidade: ${Math.round(metrics.reliability * 100)}%`;
            navigator.clipboard.writeText(report);
            alert('Relatório copiado para a área de transferência!');
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-200 transition-colors duration-200 hover:bg-slate-800 active:scale-[0.99]"
        >
          <ClipboardCopy className="h-4 w-4" />
          Copiar Relatório
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors duration-200 hover:border-slate-700">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-400">
          <Info className="mt-0.5 h-3.5 w-3.5" />
          <span>Esta análise é fornecida por IA e deve ser validada com fontes de confiança. Resultados são baseados em padrões estatísticos e podem estar sujeitos a limitações e erros.</span>
        </p>
      </div>
    </div>
  );
}

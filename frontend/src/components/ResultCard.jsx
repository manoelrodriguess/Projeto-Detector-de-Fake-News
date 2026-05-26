import { AlertTriangle, BadgeCheck, BarChart3, ClipboardCopy, Info, RotateCcw } from 'lucide-react';

export default function ResultCard({ result, onAnalyzeAnother }) {
  if (!result) return null;

  const isTrue = result.classification === 'true';
  const confidence = Math.round(result.confidence * 100);

  return (
    <div className="w-full animate-fadeIn">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div
          className={`px-6 py-4 border-b ${
            isTrue
              ? 'border-emerald-900/60 bg-slate-950'
              : 'border-red-900/60 bg-slate-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-slate-400">
                RESULTADO DA ANÁLISE
              </p>
              <h2 className={`flex items-center gap-2 text-3xl font-semibold ${isTrue ? 'text-emerald-300' : 'text-red-300'}`}>
                {isTrue ? <BadgeCheck className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                {isTrue ? 'VERDADEIRO' : 'SUSPEITO'}
              </h2>
            </div>
            <div className="text-right">
              <p className="mb-1 text-sm text-slate-400">Confiança</p>
              <div className="text-4xl font-semibold text-slate-100">
                {confidence}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 px-6 py-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                isTrue ? 'bg-emerald-400' : 'bg-red-400'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {result.indicators && result.indicators.length > 0 && (
          <div className="border-t border-slate-800 px-6 py-4">
            <p className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
              <BarChart3 className="h-4 w-4" />
              Principais Indicadores
            </p>
            <ul className="space-y-2">
              {result.indicators.map((indicator, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-slate-300 text-sm"
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isTrue ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                    •
                  </span>
                  <span>{indicator}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 border-t border-slate-800 bg-slate-950 px-6 py-4">
          <button
            onClick={onAnalyzeAnother}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-100 px-4 py-2 font-semibold text-slate-950 transition-colors duration-200 hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" />
            Analisar Outro Texto
          </button>
          <button
            onClick={() => {
              const resultText = `Classificação: ${isTrue ? 'VERDADEIRO' : 'SUSPEITO'}\nConfiança: ${confidence}%`;
              navigator.clipboard.writeText(resultText);
              alert('Resultado copiado para a área de transferência!');
            }}
            className="flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-4 py-2 font-semibold text-slate-200 transition-colors duration-200 hover:bg-slate-800"
            title="Copiar resultado"
          >
            <ClipboardCopy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <Info className="h-3.5 w-3.5" />
        Esta análise é fornecida por IA e deve ser validada com fontes de confiança
      </p>
    </div>
  );
}

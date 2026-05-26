import { Cpu, ScanSearch, ShieldCheck } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-slate-300 animate-spin" style={{ animationDuration: '2.5s' }} />
          <div className="absolute inset-3 rounded-full border-3 border-transparent border-r-slate-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-6 rounded-full border-2 border-transparent border-b-slate-400 animate-spin" style={{ animationDuration: '1s' }} />
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center space-y-3">
        <div className="space-y-1">
          <p className="text-xl font-semibold text-slate-100 animate-slideInDown">
            Analisando Notícia...
          </p>
          <p className="text-slate-400 text-sm animate-slideInDown" style={{ animationDelay: '0.1s' }}>
            Processando com IA Explicável
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="h-2 w-2 rounded-full bg-slate-400" style={{ animation: 'pulse 1s ease-in-out infinite' }} />
          <div className="h-2 w-2 rounded-full bg-slate-500" style={{ animation: 'pulse 1s ease-in-out infinite 0.2s' }} />
          <div className="h-2 w-2 rounded-full bg-slate-600" style={{ animation: 'pulse 1s ease-in-out infinite 0.4s' }} />
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm space-y-2 text-xs">
        <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 animate-slideInDown">
          <ScanSearch className="h-4 w-4 text-slate-300" />
          <span className="text-slate-300">Coletando dados e padrões</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 animate-slideInDown" style={{ animationDelay: '0.1s' }}>
          <Cpu className="h-4 w-4 text-slate-300" />
          <span className="text-slate-300">Processando com modelos de IA</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 animate-slideInDown" style={{ animationDelay: '0.2s' }}>
          <ShieldCheck className="h-4 w-4 text-slate-300" />
          <span className="text-slate-300">Gerando explicabilidade</span>
        </div>
      </div>
    </div>
  );
}

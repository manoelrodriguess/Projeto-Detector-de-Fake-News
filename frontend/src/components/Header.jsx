import { ScanSearch, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-100">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                Detector de Fake News
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Painel forense para análise de credibilidade jornalística
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-slate-300">
            <ScanSearch className="h-4 w-4 text-slate-200" />
            <span className="text-xs font-medium">Sistema operacional</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
          <p className="text-center text-sm leading-relaxed text-slate-400">
            Analise notícias e identifique sinais de manipulação com uma interface projetada para investigação, rastreabilidade e leitura rápida.
          </p>
        </div>
      </div>
    </header>
  );
}

// Cabeçalho moderno com glassmorphism e efeito visual avançado
export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-xl border-b border-slate-700/30 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30 shadow-lg shadow-blue-500/20">
              <span className="text-3xl">🔍</span>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Detector de Fake News
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                IA Explicável para Análise de Notícias
              </p>
            </div>
          </div>

          {/* Badge de Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-green-400">Sistema Ativo</span>
          </div>
        </div>

        {/* Descrição adicional */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/20 rounded-lg">
          <p className="text-center text-slate-300 text-sm leading-relaxed">
            Analise notícias e identifique potenciais fake news usando inteligência artificial avançada. 
            Nossa solução fornece explicabilidade completa sobre cada análise para uma tomada de decisão informada.
          </p>
        </div>
      </div>
    </header>
  );
}

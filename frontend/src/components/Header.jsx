// Cabeçalho moderno com glassmorphism e efeito visual avançado
export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-b from-slate-950/98 via-slate-950/90 to-slate-950/70 backdrop-blur-2xl border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo e Título */}
          <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 backdrop-blur-md rounded-xl border border-blue-400/40 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
              <img 
                src="/logo.png" 
                alt="Detector de Fake News" 
                className="h-12 w-12 object-contain filter drop-shadow-lg"
              />
            </div>
            
            <div className="group">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:via-cyan-200 group-hover:to-blue-200 transition-all duration-300">
                Detector de Fake News
              </h1>
              <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-300 transition-colors duration-300">
                IA Explicável para Análise de Notícias
              </p>
            </div>
          </div>

          {/* Badge de Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/60 to-slate-800/40 backdrop-blur-md border border-green-500/30 rounded-full shadow-lg shadow-green-500/10 hover:border-green-400/60 transition-all duration-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg shadow-green-500/50" />
            </span>
            <span className="text-xs font-semibold text-green-300">Sistema Ativo</span>
          </div>
        </div>

        {/* Descrição adicional */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-cyan-500/15 backdrop-blur-lg border border-blue-400/30 rounded-xl hover:border-blue-400/60 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20">
          <p className="text-center text-slate-300 text-sm leading-relaxed hover:text-slate-200 transition-colors duration-300">
            Analise notícias e identifique potenciais fake news usando inteligência artificial avançada. 
            Nossa solução fornece explicabilidade completa sobre cada análise para uma tomada de decisão informada.
          </p>
        </div>
      </div>
    </header>
  );
}

// Componente de spinner animado para indicar carregamento da IA
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Container principal com glassmorphism */}
      <div className="relative">
        {/* Spinner principal com múltiplas camadas */}
        <div className="relative w-24 h-24">
          
          {/* Camada 1: Spinner externo lento */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-700/50 border-t-blue-500 animate-spin shadow-lg shadow-blue-500/30" style={{ animationDuration: '2.5s' }} />
          
          {/* Camada 2: Spinner intermediário rápido */}
          <div className="absolute inset-3 rounded-full border-3 border-transparent border-r-cyan-500 animate-spin shadow-lg shadow-cyan-500/30" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          
          {/* Camada 3: Spinner interno com pulsação */}
          <div className="absolute inset-6 rounded-full border-2 border-transparent border-b-purple-500 animate-spin shadow-lg shadow-purple-500/30" style={{ animationDuration: '1s' }} />
          
          {/* Centro brilhante */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/70 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Textos informativos com animação */}
      <div className="mt-8 text-center space-y-3">
        <div className="space-y-1">
          <p className="text-xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent animate-slideInDown">
            Analisando Notícia...
          </p>
          <p className="text-slate-400 text-sm animate-slideInDown hover:text-slate-300 transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
            Processando com IA Explicável
          </p>
        </div>
        
        {/* Indicadores de progresso */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div
            className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/60"
            style={{
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
          <div
            className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/60"
            style={{
              animation: 'pulse 1s ease-in-out infinite 0.2s',
            }}
          />
          <div
            className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/60"
            style={{
              animation: 'pulse 1s ease-in-out infinite 0.4s',
            }}
          />
        </div>
      </div>

      {/* Etapas do processamento */}
      <div className="mt-8 w-full max-w-sm space-y-2 text-xs">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/15 to-blue-600/10 backdrop-blur-md border border-blue-400/40 rounded-lg animate-slideInDown hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <span className="text-lg">📊</span>
          <span className="text-blue-300 hover:text-blue-200 transition-colors">Coletando dados e padrões</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-500/15 to-cyan-600/10 backdrop-blur-md border border-cyan-400/40 rounded-lg animate-slideInDown hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
          <span className="text-lg">🤖</span>
          <span className="text-cyan-300 hover:text-cyan-200 transition-colors">Processando com modelos de IA</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/15 to-purple-600/10 backdrop-blur-md border border-purple-400/40 rounded-lg animate-slideInDown hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
          <span className="text-lg">✨</span>
          <span className="text-purple-300 hover:text-purple-200 transition-colors">Gerando explicabilidade</span>
        </div>
      </div>
    </div>
  );
}

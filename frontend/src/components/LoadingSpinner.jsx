// Componente de spinner animado para indicar carregamento da IA
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Container principal com glassmorphism */}
      <div className="relative">
        {/* Spinner principal com múltiplas camadas */}
        <div className="relative w-24 h-24">
          
          {/* Camada 1: Spinner externo lento */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-700/50 border-t-blue-500 animate-spin" style={{ animationDuration: '2.5s' }} />
          
          {/* Camada 2: Spinner intermediário rápido */}
          <div className="absolute inset-3 rounded-full border-3 border-transparent border-r-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          
          {/* Camada 3: Spinner interno com pulsação */}
          <div className="absolute inset-6 rounded-full border-2 border-transparent border-b-purple-500 animate-spin" style={{ animationDuration: '1s' }} />
          
          {/* Centro brilhante */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Textos informativos com animação */}
      <div className="mt-8 text-center space-y-3">
        <div className="space-y-1">
          <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent animate-slideInDown">
            Analisando Notícia...
          </p>
          <p className="text-slate-400 text-sm animate-slideInDown" style={{ animationDelay: '0.1s' }}>
            Processando com IA Explicável
          </p>
        </div>
        
        {/* Indicadores de progresso */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div
            className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
            style={{
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
          <div
            className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"
            style={{
              animation: 'pulse 1s ease-in-out infinite 0.2s',
            }}
          />
          <div
            className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"
            style={{
              animation: 'pulse 1s ease-in-out infinite 0.4s',
            }}
          />
        </div>
      </div>

      {/* Etapas do processamento */}
      <div className="mt-8 w-full max-w-sm space-y-2 text-xs">
        <div className="flex items-center gap-3 p-3 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-lg animate-slideInDown">
          <span className="text-lg">📊</span>
          <span className="text-blue-300">Coletando dados e padrões</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-lg animate-slideInDown" style={{ animationDelay: '0.1s' }}>
          <span className="text-lg">🤖</span>
          <span className="text-cyan-300">Processando com modelos de IA</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-lg animate-slideInDown" style={{ animationDelay: '0.2s' }}>
          <span className="text-lg">✨</span>
          <span className="text-purple-300">Gerando explicabilidade</span>
        </div>
      </div>
    </div>
  );
}

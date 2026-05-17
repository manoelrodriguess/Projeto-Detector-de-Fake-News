import { useState } from 'react';

// Componente de input para colar/digitar a notícia a ser analisada
export default function NewsInput({ onAnalyze, isLoading, disabled = false }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    // Limpar erro anterior
    setError('');

    // Validações
    if (!text.trim()) {
      setError('Por favor, digite ou cole uma notícia para analisar');
      return;
    }

    if (text.trim().length < 50) {
      setError('A notícia deve ter pelo menos 50 caracteres para uma análise confiável');
      return;
    }

    // Chamar função do parent
    onAnalyze(text);
  };

  const handleKeyDown = (e) => {
    // Permitir Ctrl+Enter para enviar
    if (e.ctrlKey && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const charCount = text.length;
  const isValid = text.trim().length >= 50;
  const percentage = Math.min((charCount / 50) * 100, 100);

  return (
    <div className="w-full space-y-4">
      <label htmlFor="newsInput" className="block text-white font-bold text-lg">
        📝 Cole ou Digite uma Notícia
      </label>

      <div className="relative">
        <textarea
          id="newsInput"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder="Digite ou cole uma notícia, postagem, artigo ou qualquer texto para análise..."
          className="w-full h-48 p-4 bg-slate-900/80 text-white border-2 border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-500 backdrop-blur-sm transition-all duration-200 hover:border-slate-500"
        />

        {/* Indicador de caracteres no canto */}
        <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all ${
          charCount < 50
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50'
            : 'bg-green-500/20 text-green-300 border-green-400/50'
        }`}>
          {charCount} / 50
        </div>
      </div>

      {/* Barra de progresso de caracteres */}
      <div className="w-full h-1.5 rounded-full bg-slate-700/50 backdrop-blur-sm overflow-hidden border border-slate-600/50">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isValid ? 'bg-gradient-to-r from-green-500 to-cyan-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
          }`}
          style={{
            width: `${percentage}%`,
            boxShadow: isValid
              ? '0 0 10px rgba(34, 197, 94, 0.5)'
              : '0 0 10px rgba(251, 146, 60, 0.5)',
          }}
        />
      </div>

      {/* Mensagem de erro com animação */}
      {error && (
        <div className="animate-slideInDown p-4 bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-lg text-red-300 text-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Botão de análise com estado */}
      <button
        onClick={handleAnalyze}
        disabled={disabled || isLoading || !isValid}
        className={`w-full px-6 py-4 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg font-bold ${
          !isValid || isLoading
            ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-600/50'
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 border border-blue-400/50 hover:border-blue-300/50'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analisando...
          </>
        ) : !isValid ? (
          <>
            🔒 Mínimo 50 caracteres
          </>
        ) : (
          <>
            🚀 Analisar
          </>
        )}
      </button>

      <p className="text-slate-500 text-xs text-center leading-relaxed">
        💡 Dica: pressione <span className="bg-slate-800/50 px-2 py-1 rounded text-slate-400">Ctrl+Enter</span> para enviar mais rapidamente
      </p>
    </div>
  );
}

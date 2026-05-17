import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Mínimo de caracteres requerido para análise
const MIN_TEXT_LENGTH = 50;

// Componente de entrada de notícia com validação
export default function NewsInput({ onAnalyze, isLoading }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const trimmedText = text.trim();
  const isAnalyzeDisabled = trimmedText.length < MIN_TEXT_LENGTH;

  const handleAnalyze = () => {
    // Validação: verificar se o texto tem pelo menos MIN_TEXT_LENGTH caracteres
    if (trimmedText.length < MIN_TEXT_LENGTH) {
      setError(`O texto deve ter pelo menos ${MIN_TEXT_LENGTH} caracteres`);
      return;
    }

    setError('');
    onAnalyze(trimmedText);
  };

  const handleClear = () => {
    setText('');
    setError('');
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-lg">
      <div className="mb-6">
        <label htmlFor="newsInput" className="block text-lg font-semibold text-white mb-3">
          Cole ou digite a notícia para análise
        </label>
        <textarea
          id="newsInput"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          disabled={isLoading}
          placeholder="Exemplo: Digite ou cole o texto da notícia aqui para que possamos analisar se é verdadeiro ou suspeito..."
          className="w-full h-40 bg-slate-700 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {error && (
          <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>
        )}
        <p className="text-slate-400 text-xs mt-2">
          {trimmedText.length} caracteres
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzeDisabled}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Analisar
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✕ Limpar
          </button>
        </div>
      )}
    </div>
  );
}

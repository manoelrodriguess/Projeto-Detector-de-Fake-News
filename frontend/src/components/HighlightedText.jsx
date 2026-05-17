// Componente que exibe o texto com destaque das palavras identificadas como suspeitas
export default function HighlightedText({ text, highlightedTerms = [] }) {
  if (!text) return null;

  // Ordena os termos destacados por posição decrescente para evitar conflitos de índice
  const sortedTerms = highlightedTerms
    .map(term => ({
      ...term,
      index: text.toLowerCase().indexOf(term.word.toLowerCase()),
    }))
    .filter(term => term.index !== -1)
    .sort((a, b) => b.index - a.index);

  let highlightedText = text;

  // Substitui cada termo pelo componente de highlight
  sortedTerms.forEach(({ word, type }) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      `<mark data-type="${type}">${word}</mark>`
    );
  });

  return (
    <div className="w-full space-y-3">
      <h3 className="text-lg font-semibold text-white">📄 Análise do Texto</h3>
      
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6 leading-relaxed text-slate-200 max-h-64 overflow-y-auto">
        {/* Renderiza o texto com highlights */}
        {sortedTerms.length === 0 ? (
          <p className="text-slate-400">{text}</p>
        ) : (
          <p className="whitespace-pre-wrap">
            {text.split(/(\s+)/).map((word, index) => {
              const found = highlightedTerms.find(
                term => term.word.toLowerCase() === word.toLowerCase()
              );

              if (!found) {
                return word;
              }

              return (
                <span
                  key={index}
                  className={`px-2 py-1 rounded font-semibold transition-all ${
                    found.type === 'suspicious'
                      ? 'bg-red-500/30 text-red-200 border border-red-400/50 hover:bg-red-500/50'
                      : found.type === 'warning'
                      ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50 hover:bg-yellow-500/50'
                      : 'bg-blue-500/30 text-blue-200 border border-blue-400/50 hover:bg-blue-500/50'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>
        )}
      </div>

      {/* Legenda */}
      {sortedTerms.length > 0 && (
        <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded bg-red-500/30 border border-red-400/50" />
            <span className="text-slate-400">Suspeito</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-400/50" />
            <span className="text-slate-400">Aviso</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-400/50" />
            <span className="text-slate-400">Relevante</span>
          </div>
        </div>
      )}
    </div>
  );
}

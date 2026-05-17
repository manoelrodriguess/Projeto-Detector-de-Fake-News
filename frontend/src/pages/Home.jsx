import NewsInput from '../components/NewsInput';
import ResultCard from '../components/ResultCard';

// Página principal com composição dos componentes
export default function Home({ result, setResult, isLoading, error, setError, onAnalyze }) {
  const handleAnalyzeAnother = () => {
    setResult(null);
    setError('');
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Mostrar resultado se existir, senão mostrar formulário */}
      {result ? (
        <>
          <ResultCard result={result} onAnalyzeAnother={handleAnalyzeAnother} />
          <div className="mt-8">
            <NewsInput onAnalyze={onAnalyze} isLoading={isLoading} />
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <p className="text-slate-400 text-center text-lg">
              Digite ou cole um texto para que nosso detector analise se é provavelmente verdadeiro ou suspeito
            </p>
          </div>
          <NewsInput onAnalyze={onAnalyze} isLoading={isLoading} />
          {error && (
            <div className="mt-6 bg-red-900 border border-red-700 rounded-lg p-4 text-red-300">
              <p>❌ Erro: {error}</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}

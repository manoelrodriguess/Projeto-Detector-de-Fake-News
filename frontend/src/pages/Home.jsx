import { useState } from 'react';
import NewsInput from '../components/NewsInput';
import AnalysisResult from '../components/AnalysisResult';
import PillarsSection from '../components/PillarsSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeNews, getMockExamples } from '../services/api';

// Página principal da aplicação com painel analítico avançado
export default function Home() {
  // Estados da aplicação
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalText, setOriginalText] = useState('');

  // Função para analisar a notícia
  const handleAnalyze = async (newsText) => {
    setText(newsText);
    setOriginalText(newsText);
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Simula um delay de processamento para melhor UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysisResult = await analyzeNews(newsText);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Erro desconhecido ao analisar a notícia');
      console.error('Erro na análise:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para limpar e analisar outro texto
  const handleAnalyzeAnother = () => {
    setText('');
    setOriginalText('');
    setResult(null);
    setError('');
  };

  return (
    <main className="flex-grow w-full px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Área de input em primeiro plano */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl hover:shadow-2xl hover:border-slate-600/80 transition-all duration-300">
          <NewsInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>

        {/* Botões de exemplos para demonstração */}
        {!result && !isLoading && !error && (
          <div className="bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-cyan-500/15 backdrop-blur-xl border border-blue-400/40 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            <p className="text-sm font-semibold text-slate-300 mb-4">📚 Ou carregue um exemplo para demonstração:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleAnalyze(getMockExamples()['true'].text)}
                className="px-4 py-4 bg-gradient-to-br from-green-500/25 to-green-600/15 hover:from-green-500/40 hover:to-green-600/25 border border-green-500/60 rounded-xl text-green-300 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/40 hover:scale-105 active:scale-95 backdrop-blur-sm group"
              >
                <span className="group-hover:text-green-200 transition-colors">✅ Notícia Verdadeira</span>
              </button>
              <button
                onClick={() => handleAnalyze(getMockExamples()['fake'].text)}
                className="px-4 py-4 bg-gradient-to-br from-red-500/25 to-red-600/15 hover:from-red-500/40 hover:to-red-600/25 border border-red-500/60 rounded-xl text-red-300 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95 backdrop-blur-sm group"
              >
                <span className="group-hover:text-red-200 transition-colors">❌ Fake News</span>
              </button>
              <button
                onClick={() => handleAnalyze(getMockExamples()['uncertain'].text)}
                className="px-4 py-4 bg-gradient-to-br from-yellow-500/25 to-orange-600/15 hover:from-yellow-500/40 hover:to-orange-600/25 border border-yellow-500/60 rounded-xl text-yellow-300 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/40 hover:scale-105 active:scale-95 backdrop-blur-sm group"
              >
                <span className="group-hover:text-yellow-200 transition-colors">⚠️ Notícia Questionável</span>
              </button>
            </div>
          </div>
        )}

        {/* Estado Inicial: Pilares informativos */}
        {!result && !isLoading && !error && (
          <>
            <PillarsSection />
            
            <div className="text-center py-8 text-slate-400 animate-fadeIn">
              <p className="text-lg font-medium hover:text-slate-300 transition-colors duration-300">
                👆 Cole ou digite uma notícia para começar a análise
              </p>
              <p className="text-sm mt-2 text-slate-500 hover:text-slate-400 transition-colors duration-300">
                Mínimo de 50 caracteres necessário para análise confiável
              </p>
            </div>
          </>
        )}

        {/* Área de loading com animação */}
        {isLoading && (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl animate-pulse">
            <LoadingSpinner />
          </div>
        )}

        {/* Área de erro */}
        {error && !isLoading && (
          <div className="p-6 bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-xl border border-red-500/60 rounded-2xl text-red-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 animate-slideInDown">
            <p className="font-semibold text-lg mb-2">❌ Erro ao analisar</p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Dashboard de resultados */}
        {result && !isLoading && (
          <AnalysisResult 
            result={result} 
            originalText={originalText}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        )}
      </div>
    </main>
  );
}

import { useState } from 'react';
import NewsInput from '../components/NewsInput';
import AnalysisResult from '../components/AnalysisResult';
import PillarsSection from '../components/PillarsSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeNews } from '../services/api';

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
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <NewsInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>

        {/* Estado Inicial: Pilares informativos */}
        {!result && !isLoading && !error && (
          <>
            <PillarsSection />
            
            <div className="text-center py-8 text-slate-400">
              <p className="text-lg font-medium">
                👆 Cole ou digite uma notícia para começar a análise
              </p>
              <p className="text-sm mt-2">
                Mínimo de 50 caracteres necessário para análise confiável
              </p>
            </div>
          </>
        )}

        {/* Área de loading com animação */}
        {isLoading && (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-12 shadow-2xl">
            <LoadingSpinner />
          </div>
        )}

        {/* Área de erro */}
        {error && !isLoading && (
          <div className="p-6 bg-red-900/20 backdrop-blur-xl border border-red-500/50 rounded-xl text-red-300 shadow-lg shadow-red-500/10">
            <p className="font-semibold text-lg mb-2">❌ Erro ao analisar</p>
            <p className="text-sm">{error}</p>
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

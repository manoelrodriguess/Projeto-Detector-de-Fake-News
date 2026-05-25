import { useState } from 'react';
import NewsInput from '../components/NewsInput';
import AnalysisResult from '../components/AnalysisResult';
import PillarsSection from '../components/PillarsSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeNews, analyzeNewsFile, getRandomNews } from '../services/api';

// Página principal da aplicação com painel analítico avançado
export default function Home() {
  // Estados da aplicação
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Função para analisar a notícia
  const handleAnalyze = async (newsText) => {
    setText(newsText);
    setOriginalText(newsText);
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
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
    setSelectedFile(null);
  };

  const handleAnalyzeFile = async (file) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const analysisResult = await analyzeNewsFile(file);
      setResult(analysisResult);
      setOriginalText(analysisResult.extractedText || '');
    } catch (err) {
      setError(err.message || 'Erro desconhecido ao analisar o arquivo');
      console.error('Erro na análise do arquivo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadRandomNews = async () => {
    setIsLoading(true);
    setError('');

    try {
      const randomNews = await getRandomNews();
      setText(randomNews.text || '');
      setOriginalText('');
      setResult(null);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar uma notícia aleatória');
      console.error('Erro ao carregar notícia aleatória:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grow w-full px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Área de input em primeiro plano */}
        <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl hover:shadow-2xl hover:border-slate-600/80 transition-all duration-300">
          <NewsInput
            text={text}
            setText={setText}
            onAnalyze={handleAnalyze}
            onAnalyzeFile={handleAnalyzeFile}
            onLoadRandomNews={handleLoadRandomNews}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>

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
          <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl animate-pulse">
            <LoadingSpinner />
          </div>
        )}

        {/* Área de erro */}
        {error && !isLoading && (
          <div className="p-6 bg-linear-to-br from-red-900/30 to-red-800/20 backdrop-blur-xl border border-red-500/60 rounded-2xl text-red-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 animate-slideInDown">
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

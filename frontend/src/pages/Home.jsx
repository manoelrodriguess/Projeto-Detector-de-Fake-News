import { useState } from 'react';
import NewsInput from '../components/NewsInput';
import AnalysisResult from '../components/AnalysisResult';
import PillarsSection from '../components/PillarsSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertTriangle, ScanSearch } from 'lucide-react';
import { analyzeNews, analyzeNewsFile, getRandomNews } from '../services/api';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition-colors duration-200 hover:border-slate-700">
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

        {!result && !isLoading && !error && (
          <>
            <PillarsSection />

            <div className="flex flex-col items-center gap-2 py-8 text-center text-slate-400 animate-fadeIn">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200">
                <ScanSearch className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium text-slate-300 transition-colors duration-300">
                Cole ou digite uma notícia para começar a análise
              </p>
              <p className="text-sm text-slate-500 transition-colors duration-300">
                Mínimo de 50 caracteres necessário para análise confiável
              </p>
            </div>
          </>
        )}

        {isLoading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 animate-pulse">
            <LoadingSpinner />
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-red-900/60 bg-slate-900 p-6 text-red-200 animate-slideInDown">
            <p className="mb-2 flex items-center gap-2 text-lg font-semibold text-red-100">
              <AlertTriangle className="h-5 w-5" />
              Erro ao analisar
            </p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

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

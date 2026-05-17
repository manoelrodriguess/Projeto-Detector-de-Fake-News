import { useState } from 'react';
import './index.css';
import Header from './components/Header';
import Home from './pages/Home';
import { analyzeNews } from './services/api';

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para disparar a análise
  const handleAnalyze = async (newsText) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const analysisResult = await analyzeNews(newsText);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Erro ao analisar a notícia. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <Home
        result={result}
        setResult={setResult}
        isLoading={isLoading}
        error={error}
        setError={setError}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
}

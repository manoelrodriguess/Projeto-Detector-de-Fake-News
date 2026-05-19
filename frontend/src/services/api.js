// Serviço de comunicação com a API do backend (FastAPI)
// Endpoint base para as requisições
import { mockAnalyzeNews, mockExamples } from './mockData';

const API_BASE_URL = 'http://localhost:8000';
let isBackendAvailable = true;

/**
 * Analisa um texto para detectar se é fake news ou verdadeiro
 * Com fallback automático para dados mock quando backend não estiver disponível
 * @param {string} text - O texto da notícia a ser analisado
 * @returns {Promise<{classification: string, confidence: number, indicators: array}>}
 */
export const analyzeNews = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('O texto não pode estar vazio');
    }

    // Se backend não estava disponível antes, pula direto para mock
    if (!isBackendAvailable) {
      return await mockAnalyzeNews(text);
    }

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      throw new Error(
        `Erro no servidor (${response.status}): ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validar resposta
    if (!data.classification || data.confidence === undefined) {
      throw new Error('Resposta inválida do servidor');
    }

    return {
      classification: data.classification, // "fake" ou "true"
      confidence: data.confidence, // número entre 0 e 1
      indicators: data.indicators || [], // array de strings
    };
  } catch (error) {
    // Se backend falhar, ativa modo offline com mocks
    isBackendAvailable = false;
    console.warn('Backend indisponível. Usando dados mock para demonstração:', error.message);
    return await mockAnalyzeNews(text);
  }
};

/**
 * Retorna os exemplos mock disponíveis para demonstração
 * Útil para o professor testar a plataforma
 */
export const getMockExamples = () => {
  return mockExamples;
};

/**
 * Retorna um exemplo específico para demonstração rápida
 * @param {string} type - 'true', 'fake' ou 'uncertain'
 */
export const getMockExample = (type) => {
  return mockExamples[type] || null;
};

// Serviço de comunicação com a API do backend (FastAPI)
// Endpoint base para as requisições

const API_BASE_URL = 'http://localhost:8000';

/**
 * Analisa um texto para detectar se é fake news ou verdadeiro
 * @param {string} text - O texto da notícia a ser analisado
 * @returns {Promise<{classification: string, confidence: number, indicators: array}>}
 * @throws {Error} Erro de rede ou resposta inválida
 */
export const analyzeNews = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('O texto não pode estar vazio');
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
    if (error instanceof TypeError) {
      throw new Error(
        'Erro de conexão: não foi possível alcançar o servidor. Verifique se o backend está rodando em http://localhost:8000'
      );
    }
    throw error;
  }
};

/**
 * Dados Simulados para Teste do Frontend
 * Estes são dados mock para demonstrar a interface sem backend
 * Em produção, substitua pela API real em api.js
 */

// ============================================================================
// EXEMPLOS DE ANÁLISE
// ============================================================================

export const mockExamples = {
  // Exemplo 1: Notícia Verdadeira
  true: {
    text: "A OMS confirmou que o sistema de vacinação internacional é efetivo. Milhões de pessoas foram vacinadas com sucesso, reduzindo hospitalização em 85%. Os dados provêm de estudos revisados por pares e organizações de saúde confiáveis.",
    result: {
      classification: "true",
      confidence: 0.89,
      indicators: [
        "Organismos de saúde confiáveis citados (OMS)",
        "Informações baseadas em estudos científicos",
        "Dados corroborados internacionalmente",
        "Ausência de linguagem emotiva",
        "Fatos verificáveis e quantificados",
      ],
    },
  },

  // Exemplo 2: Notícia Falsa/Suspeita
  fake: {
    text: "CHOCANTE!!! Bilionário secreto revela como governos escondem a VERDADE ABSOLUTA sobre nanopartículas! Clique AGORA para descobrir o que NINGUÉM quer que você saiba!!! Govenos [sic] escondem informações CRÍTICAS!!!",
    result: {
      classification: "fake",
      confidence: 0.94,
      indicators: [
        "Múltiplos pontos de exclamação (sensacionalismo extremo)",
        "Apelo emocional e urgência artificiais",
        "Afirmações extraordinárias sem evidência",
        "Fonte anônima e não verificável",
        "Padrão típico de clickbait/scam",
        "Uso excessivo de CAPS e caracteres especiais",
      ],
    },
  },

  // Exemplo 3: Notícia Questionável
  uncertain: {
    text: "O governante X anunciou novas medidas econômicas que alguns economistas consideram benéficas, enquanto outros alertam sobre possíveis riscos. As opiniões continuam divididas entre especialistas.",
    result: {
      classification: "fake",
      confidence: 0.48,
      indicators: [
        "Linguagem equilibrada mas vaga",
        "Falta de dados específicos e quantificáveis",
        "Opiniões apresentadas como fatos",
        "Contexto histórico incompleto",
        "Tendência política implícita não explicitada",
      ],
    },
  },
};

// ============================================================================
// TERMOS PARA HIGHLIGHTING
// ============================================================================

/**
 * Termos pré-configurados para demonstração de highlighting
 * Em produção, esses viriam do backend após análise
 */
export const getHighlightedTerms = (classification) => {
  if (classification === "fake") {
    return [
      { word: "CHOCANTE", type: "suspicious" },
      { word: "secreto", type: "suspicious" },
      { word: "VERDADE ABSOLUTA", type: "suspicious" },
      { word: "NINGUÉM quer", type: "suspicious" },
      { word: "CRÍTICAS", type: "warning" },
      { word: "Clique AGORA", type: "suspicious" },
    ];
  } else if (classification === "true") {
    return [
      { word: "OMS", type: "relevant" },
      { word: "85%", type: "relevant" },
      { word: "estudos revisados", type: "relevant" },
    ];
  }
  return [];
};

// ============================================================================
// SIMULADOR DE ANÁLISE
// ============================================================================

/**
 * Função para simular análise de IA no frontend
 * Útil para testes rápidos sem backend
 * @param {string} text - Texto a analisar
 * @returns {Promise<object>} - Resultado da análise
 */
export const mockAnalyzeNews = async (text) => {
  // Simula delay de processamento
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Análise básica para demonstração
  const textLower = text.toLowerCase();
  const isSuspicious =
    textLower.includes("clique") ||
    textLower.includes("!!!") ||
    textLower.includes("chocante") ||
    textLower.includes("verdade escondida") ||
    (text.match(/!/g) || []).length > 3;

  const confidence = isSuspicious
    ? Math.random() * 0.4 + 0.6 // 0.6 - 1.0 para false
    : Math.random() * 0.3 + 0.7; // 0.7 - 1.0 para true

  return {
    classification: isSuspicious ? "fake" : "true",
    confidence: Math.round(confidence * 100) / 100,
    indicators: isSuspicious
      ? [
          "Linguagem sensacionalista detectada",
          "Uso excessivo de pontuação",
          "Apelos emocionais identificados",
          "Padrão típico de desinformação",
        ]
      : [
          "Fonte confiável identificada",
          "Informações corroboradas",
          "Linguagem factual e neutra",
          "Dados verificáveis presentes",
        ],
  };
};

// ============================================================================
// MÉTRICAS SIMULADAS
// ============================================================================

/**
 * Gera métricas de IA baseado na classificação
 * @param {boolean} isTrue - Se é verdadeiro ou falso
 * @returns {object} - Objeto com métricas
 */
export const generateMockMetrics = (isTrue) => {
  if (isTrue) {
    return {
      timeliness: 0.92,
      clarity: 0.87,
      accuracy: 0.95,
      reliability: 0.89,
    };
  }
  return {
    timeliness: 0.45,
    clarity: 0.62,
    accuracy: 0.38,
    reliability: 0.51,
  };
};

// ============================================================================
// PADRÃO DE RESPOSTA DO BACKEND (Referência)
// ============================================================================

/**
 * Formato esperado do endpoint POST /analyze no backend FastAPI
 *
 * Request:
 * {
 *   "text": "conteúdo da notícia a analisar"
 * }
 *
 * Response (200 OK):
 * {
 *   "classification": "true" | "fake",
 *   "confidence": 0.0 - 1.0,
 *   "indicators": ["indicador1", "indicador2", ...]
 * }
 *
 * Erros possíveis:
 * - 400 Bad Request: texto vazio ou muito curto
 * - 422 Unprocessable Entity: formato inválido
 * - 500 Internal Server Error: erro no processamento
 */

export default {
  mockExamples,
  getHighlightedTerms,
  mockAnalyzeNews,
  generateMockMetrics,
};

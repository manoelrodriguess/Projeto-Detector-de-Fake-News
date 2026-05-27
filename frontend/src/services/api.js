const normalizeApiBaseUrl = (value) => {
  const trimmed = String(value || 'http://localhost:8000').replace(/\/+$/, '');

  if (trimmed.endsWith('/api')) {
    return trimmed.slice(0, -4);
  }

  return trimmed;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const normalizeAnalysisResponse = (data) => {
  if (!data || !data.classification || data.confidence === undefined) {
    throw new Error('Resposta inválida do servidor');
  }

  const metrics = {
    atualizacao: Number(data.metrics?.atualizacao ?? 0),
    clareza: Number(data.metrics?.clareza ?? 0),
    precisao: Number(data.metrics?.precisao ?? 0),
    confiabilidade: Number(data.metrics?.confiabilidade ?? 0),
  };

  const suspiciousSpans = Array.isArray(data.suspicious_spans)
    ? data.suspicious_spans
        .map((item) => ({
          excerpt: item?.excerpt || item?.text || '',
          reason: item?.reason || item?.why || '',
        }))
        .filter((item) => item.excerpt)
    : [];

  return {
    classification: data.classification,
    confidence: data.confidence,
    metrics,
    indicators: data.indicators || [],
    suspiciousSpans,
    confidenceRaw: data.confidence_raw ?? null,
  };
};

export const analyzeNews = async (text) => {
  if (!text || text.trim().length === 0) {
    throw new Error('O texto não pode estar vazio');
  }

  const response = await fetch(`${API_BASE_URL}/api/analisar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: text.trim() }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `Erro no servidor (${response.status}): ${response.statusText}`
    );
  }

  const data = await response.json();
  return normalizeAnalysisResponse(data);
};

export const analyzeNewsFile = async (file) => {
  if (!file) {
    throw new Error('Nenhum arquivo foi selecionado');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/analisar-arquivo`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `Erro no servidor (${response.status}): ${response.statusText}`
    );
  }

  const data = await response.json();
  return {
    ...normalizeAnalysisResponse(data),
    extractedText: data.extracted_text || '',
  };
};

export const getRandomNews = async () => {
  const response = await fetch(`${API_BASE_URL}/api/noticia-aleatoria`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `Erro no servidor (${response.status}): ${response.statusText}`
    );
  }

  return response.json();
};

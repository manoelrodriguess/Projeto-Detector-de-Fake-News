// Serviço de API para comunicação com o backend
async function analyzeNews(text) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  try {
    const response = await fetch(`${apiUrl}/analisar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texto: text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao chamar API:', error);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    throw new Error(
      `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${apiUrl}`,
      { cause: error }
    );
  }
}

export { analyzeNews };

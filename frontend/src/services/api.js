// Serviço de API para comunicação com o backend
async function analyzeNews(text) {
  try {
    const response = await fetch('http://localhost:8000/analisar', {
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
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8000',
      { cause: error }
    );
  }
}

export { analyzeNews };

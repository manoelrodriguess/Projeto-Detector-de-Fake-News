# 🔍 Detector de Fake News - Estrutura do Projeto

## 📁 Estrutura Geral

```
Projeto-Detector-de-Fake-News/          ← Raiz do Projeto
├── START.bat                           ← Script inicialização (Windows)
├── START.sh                            ← Script inicialização (Linux/Mac)
│
├── frontend/                           ← 🎨 Aplicação React + Vite
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HighlightedText.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MetricsBar.jsx
│   │   │   ├── NewsInput.jsx
│   │   │   ├── PillarsSection.jsx
│   │   │   └── ResultCard.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   ├── api.js                 ← API real (comunica com backend)
│   │   │   └── mockData.js            ← Dados simulados para testes
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── backend/                            ← 🔌 API FastAPI (Python)
    ├── main.py
    ├── requirements.txt
    └── ...
```

---

## 🚀 Como Iniciar

### Opção 1: Iniciar Ambos (Frontend + Backend)

**Windows:**
```bash
START.bat
```

**Linux/Mac:**
```bash
bash START.sh
```

Isso abrirá automaticamente:
- Frontend em `http://localhost:5173`
- Backend em `http://localhost:8000`

### Opção 2: Iniciar Apenas Frontend

```bash
cd frontend
npm install        # Primeira vez apenas
npm run dev
```

Acesso: `http://localhost:5173`

### Opção 3: Iniciar Apenas Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate.bat
pip install -r requirements.txt
python main.py
```

Acesso: `http://localhost:8000`
Documentação: `http://localhost:8000/docs`

---

## 📦 Arquivos de Dados Simulados

O arquivo `frontend/src/services/mockData.js` contém:

- **mockExamples**: Exemplos de análises (verdadeira, falsa, incerta)
- **getHighlightedTerms()**: Termos para highlighting do texto
- **mockAnalyzeNews()**: Função simulada de análise
- **generateMockMetrics()**: Métricas simuladas de IA

### Usar Dados Simulados:

```javascript
// No seu componente
import { mockExamples, mockAnalyzeNews } from '../services/mockData';

// Para teste rápido sem backend
const result = await mockAnalyzeNews(text);
```

---

## 🔌 Comunicação Frontend ↔ Backend

### Arquivo: `frontend/src/services/api.js`

Função principal:
```javascript
analyzeNews(text) → POST /analyze
```

**Request:**
```json
{
  "text": "conteúdo da notícia"
}
```

**Response (200 OK):**
```json
{
  "classification": "true|fake",
  "confidence": 0.0-1.0,
  "indicators": ["indicador1", "indicador2"]
}
```

---

## 🎨 Stack Técnico

### Frontend
- React 19
- Vite 8
- Tailwind CSS 4
- Sem dependências externas

### Backend
- FastAPI (Python)
- Python 3.8+

---

## 📝 Guias e Documentação

Para customizações e detalhes técnicos, veja:

**No Frontend:**
- `frontend/README.md` - Instruções específicas do frontend

**Referências de Dados:**
- `frontend/src/services/mockData.js` - Exemplos de dados
- `frontend/src/services/api.js` - Documentação da API

---

## 🎯 Fluxo de Desenvolvimento

1. **Testes Rápidos**: Use `mockData.js` para testar a interface
2. **Integração**: Substitua `mockAnalyzeNews()` por chamadas reais em `api.js`
3. **Produção**: Certifique-se de que o backend está rodando

---

## ⚡ Troubleshooting

### Frontend não conecta ao Backend
```bash
# Verifique se backend está rodando
curl http://localhost:8000/docs

# Limpe cache e tente novamente
cd frontend && npm run dev
```

### "Porta 5173 já em uso"
```bash
# Verifique qual processo está usando
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173

# Ou use uma porta diferente
npm run dev -- --port 3000
```

### "Backend não responde"
```bash
# Verifique se está rodando
cd backend
python main.py

# Ou verifique logs
python -m venv venv && source venv/bin/activate
python main.py
```

---

## 📊 Estrutura do Banco de Dados (Futuro)

Quando necessário implementar persistência:
```
database/
├── migrations/
├── models.py
└── schema.sql
```

---

## 🔒 Variáveis de Ambiente

Crie arquivos `.env` se necessário:

**frontend/.env**
```
VITE_API_URL=http://localhost:8000
```

**backend/.env**
```
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=sua_chave_secreta
```

---

## 📈 Deploy

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload da pasta 'dist'
```

### Backend (Heroku/Railway)
```bash
cd backend
# Configurar requirements.txt e Procfile
heroku create seu-app
git push heroku main
```

---

## 🤝 Contribuindo

1. Crie branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m "Add: sua feature"`
3. Push: `git push origin feature/sua-feature`
4. Abra Pull Request

---

## 📞 Suporte

Para dúvidas:
1. Verifique `frontend/README.md`
2. Veja exemplos em `frontend/src/services/mockData.js`
3. Consulte a documentação do FastAPI em `http://localhost:8000/docs`

---

**Desenvolvido pela equipe Deep Analyzers** 🚀

Estrutura organizada. Projeto pronto para desenvolvimento e apresentação! ✨

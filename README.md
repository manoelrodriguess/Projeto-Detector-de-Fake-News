# 🔍 Detector de Fake News

Um projeto acadêmico de **Inteligência Artificial Explicável (XAI)** para análise e detecção de notícias falsas.

## 🚀 Quick Start

### Windows
```bash
START.bat
```

### Linux/Mac
```bash
bash START.sh
```
URL DO FRONT-END: 

URL DO BACK-END: 

Isso iniciará automaticamente:
- **Frontend**: http://localhost:5173 🎨
- **Backend**: http://localhost:8000 🔌

---

## 📋 Pré-requisitos

- **Node.js 18+** (para frontend)
- **Python 3.8+** (para backend)
- **npm** ou **yarn** (gerenciador de pacotes)

---
## 📁 Estrutura do Projeto

```
├── frontend/          ← React + Vite + Tailwind CSS
├── backend/           ← FastAPI + Python
├── START.bat          ← Inicializa ambos (Windows)
├── START.sh           ← Inicializa ambos (Linux/Mac)
└── PROJECT_STRUCTURE.md ← Documentação detalhada
```

**Veja `PROJECT_STRUCTURE.md` para detalhes completos da estrutura.**

---

## 🎯 recursos

✨ **Interface Avançada**
- dashboard analítico com glassmorphism
- Tema escuro profissional
- Animações suaves

🤖 **Explainability (IA Explicável)**
- Métricas de confiança quantificadas
- Indicadores detectados listados
- Highlighting visual do texto analisado

📊 **Componentes Principais**
- Análise de textos/notícias
- Classificação: Verdadeiro vs Falso
- Métricas de IA: Atualização, Clareza, Precisão, Confiabilidade
- Sistema de highlighting de termos suspeitos

---

## 💻 Iniciar Separadamente

### Frontend Apenas
```bash
cd frontend
npm install
npm run dev
```

### Backend Apenas
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate.bat
pip install -r requirements.txt
python main.py
```

---

## 📚 Documentação

- `PROJECT_STRUCTURE.md` - Arquitetura completa do projeto
- `frontend/README.md` - Instruções específicas do frontend
- `frontend/src/services/mockData.js` - Exemplos de dados e testes
- `frontend/src/services/api.js` - Especificação da API

---

## 🧪 Testar com Dados Simulados

Para testar o frontend sem backend:

```javascript
// frontend/src/services/mockData.js
import { mockAnalyzeNews } from '../services/mockData';

const result = await mockAnalyzeNews("seu texto aqui");
```

Dados simulados disponíveis para:
- ✅ Notícia verdadeira
- ❌ Notícia falsa
- ⚠️ Notícia questionável

---

## 🎓 Para Apresentação Acadêmica

Este projeto demonstra:
1. **Explainability**: IA não é "caixa preta"
2. **Visual Analytics**: Métricas claras e intuitivas
3. **User Experience**: Interface profissional e responsiva
4. **Clean Architecture**: Separação nítida frontend/backend

---

## 🔧 Scripts Disponíveis

```bash
# Frontend
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build

# Backend
python main.py       # Inicia servidor FastAPI
```

---

## 🌐 Endpoints da API

```
POST /analyze
├── Input:  { "text": "conteúdo" }
└── Output: { "classification", "confidence", "indicators" }
```

Documentação interativa: `http://localhost:8000/docs`

---

## 📦 Stack Técnico

**Frontend**
- React 19
- Vite 8
- Tailwind CSS 4
- Zero dependências externas

**Backend**
- FastAPI
- Python 3.8+
- Modelos de IA (a implementar)

---

## ⚙️ Variáveis de Ambiente

Se necessário, crie arquivos `.env`:

```env
# frontend/.env
VITE_API_URL=http://localhost:8000

# backend/.env
DATABASE_URL=postgresql://...
DEBUG=True
```

---

## 🚨 Troubleshooting

### "Porta já em uso"
```bash
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173
```

### "Backend não conecta"
Verifique:
1. Backend está rodando: `http://localhost:8000/docs`
2. CORS configurado no backend
3. Variável `VITE_API_URL` correta

### "npm install falha"
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Suporte

- Verifique `PROJECT_STRUCTURE.md` para arquitetura completa
- Consulte `frontend/README.md` para detalhes do frontend
- Veja exemplos em `frontend/src/services/mockData.js`

---

## 📝 Licença

Projeto acadêmico. Desenvolvido com fins educacionais.

---

**Desenvolvido pela equipe Deep Analyzers** 🚀

Pronto para apresentação e desenvolvimento! ✨

#!/bin/bash

# ============================================================================
# Script de Inicialização - Detector de Fake News
# Inicia o Frontend (React/Vite) e Backend (FastAPI) simultaneamente
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║        🚀 DETECTOR DE FAKE NEWS - Inicialização do Projeto               ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se as pastas existem
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Erro: Pasta 'frontend' não encontrada${NC}"
    exit 1
fi

if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Erro: Pasta 'backend' não encontrada${NC}"
    exit 1
fi

echo -e "${BLUE}⚙️  Verificando dependências...${NC}"
echo ""

# Verificar Frontend
echo -e "${BLUE}📦 Frontend (React/Vite):${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo -e "   ${YELLOW}→ Instalando dependências do frontend...${NC}"
    cd frontend
    npm install
    cd ..
else
    echo -e "   ${GREEN}✅ Dependências do frontend já instaladas${NC}"
fi
echo ""

# Verificar Backend
echo -e "${BLUE}📦 Backend (FastAPI):${NC}"
if [ ! -d "backend/venv" ]; then
    echo -e "   ${YELLOW}→ Criando ambiente virtual Python...${NC}"
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
else
    echo -e "   ${GREEN}✅ Ambiente virtual do backend já existe${NC}"
fi
echo ""

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo -e "${YELLOW}⏹️  Encerrando servidores...${NC}"
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servidores encerrados${NC}"
    exit 0
}

# Configurar trap para cleanup
trap cleanup EXIT INT TERM

# Iniciar Frontend em background
echo -e "${BLUE}🎨 Iniciando Frontend (React)...${NC}"
echo -e "   ${GREEN}→ Acessar: http://localhost:5173${NC}"
echo ""
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Aguardar um pouco para o frontend iniciar
sleep 3

# Iniciar Backend em background
echo -e "${BLUE}🔌 Iniciando Backend (FastAPI)...${NC}"
echo -e "   ${GREEN}→ Acessar: http://localhost:8000${NC}"
echo -e "   ${GREEN}→ Documentação: http://localhost:8000/docs${NC}"
echo ""
cd backend
source venv/bin/activate
uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Ambientes iniciados com sucesso!                                      ║"
echo "║                                                                            ║"
echo "║  Frontend:  http://localhost:5173                                         ║"
echo "║  Backend:   http://localhost:8000                                         ║"
echo "║                                                                            ║"
echo "║  Pressione Ctrl+C para parar os servidores                                ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Manter script rodando
wait

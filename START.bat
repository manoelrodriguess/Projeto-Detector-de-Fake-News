@echo off
REM ============================================================================
REM Script de Inicialização - Detector de Fake News
REM Inicia o Frontend (React/Vite) e Backend (FastAPI) simultaneamente
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║        🚀 DETECTOR DE FAKE NEWS - Inicialização do Projeto               ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

REM Cores para output (simulado com caracteres)
setlocal enabledelayedexpansion

REM Verificar se as pastas existem
if not exist "frontend\" (
    echo ❌ Erro: Pasta 'frontend' não encontrada
    exit /b 1
)

if not exist "backend\" (
    echo ❌ Erro: Pasta 'backend' não encontrada
    exit /b 1
)

echo ⚙️  Verificando dependências...
echo.

REM Verificar Frontend
echo 📦 Frontend (React/Vite):
if not exist "frontend\node_modules\" (
    echo   → Instalando dependências do frontend...
    cd frontend
    call npm install
    cd ..
) else (
    echo   ✅ Dependências do frontend já instaladas
)
echo.

REM Verificar Backend
echo 📦 Backend (FastAPI):
if not exist "backend\venv\" (
    echo   → Criando ambiente virtual Python...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    cd ..
) else (
    echo   ✅ Ambiente virtual do backend já existe
)
echo.

REM Iniciar Frontend em nova janela
echo 🎨 Iniciando Frontend (React)...
echo   → Acessar: http://localhost:5173
echo.
start "Frontend - Detector de Fake News" cmd /k "cd frontend && npm run dev"

REM Aguardar um pouco para o frontend iniciar
timeout /t 3 /nobreak

REM Iniciar Backend em nova janela
echo 🔌 Iniciando Backend (FastAPI)...
echo   → Acessar: http://localhost:8000
echo   → Documentação: http://localhost:8000/docs
echo.
start "Backend - Detector de Fake News" cmd /k "cd backend && python -m venv venv && venv\Scripts\activate.bat && python main.py"

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║  ✅ Ambientes iniciados em janelas separadas!                             ║
echo ║                                                                            ║
echo ║  Frontend:  http://localhost:5173                                         ║
echo ║  Backend:   http://localhost:8000                                         ║
echo ║                                                                            ║
echo ║  Feche as janelas para parar os servidores                                ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

pause

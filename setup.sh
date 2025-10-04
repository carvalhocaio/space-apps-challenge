#!/bin/bash

# NASA Farm Navigator - Setup Script
# Automatiza a instalação e configuração do projeto

set -e  # Sair em caso de erro

echo "NASA Farm Navigator - Setup"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}[1/5] Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED} Node.js não encontrado. Por favor, instale Node.js 20+ primeiro.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED} Node.js versão 18+ requerida. Versão atual: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN} Node.js $(node -v) encontrado${NC}"
echo ""

# Instalar dependências do backend
echo -e "${BLUE}[2/5] Instalando dependências do backend...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN} Backend configurado${NC}"
echo ""

# Instalar dependências do frontend
echo -e "${BLUE}[3/5] Instalando dependências do frontend...${NC}"
cd frontend
npm install
cd ..
echo -e "${GREEN} Frontend configurado${NC}"
echo ""

# Criar arquivo .env do backend se não existir
echo -e "${BLUE}[4/5] Configurando variáveis de ambiente...${NC}"
if [ ! -f backend/.env ]; then
    cp .env.example backend/.env
    echo -e "${GREEN} Arquivo backend/.env criado${NC}"
    echo -e "${RED}  IMPORTANTE: Adicione sua OPENAI_API_KEY no arquivo backend/.env${NC}"
else
    echo -e "${GREEN} backend/.env já existe${NC}"
fi

# Criar arquivo .env.local do frontend se não existir
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo -e "${GREEN} Arquivo frontend/.env.local criado${NC}"
else
    echo -e "${GREEN} frontend/.env.local já existe${NC}"
fi
echo ""

# Instruções finais
echo -e "${BLUE}[5/5] Setup completo!${NC}"
echo ""
echo "================================"
echo -e "${GREEN} Instalação concluída com sucesso!${NC}"
echo ""
echo "Próximos passos:"
echo ""
echo "1. Configure sua chave OpenAI:"
echo -e "   ${BLUE}nano backend/.env${NC}"
echo "   Adicione: OPENAI_API_KEY=sk-your-key-here"
echo ""
echo "2. Inicie o backend (Terminal 1):"
echo -e "   ${BLUE}cd backend && npm run dev${NC}"
echo ""
echo "3. Inicie o frontend (Terminal 2):"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "4. Acesse o jogo:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "================================"
echo ""

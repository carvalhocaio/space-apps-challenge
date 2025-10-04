# 🌱 NASA Farm Navigator

**RPG de Texto Educativo | NASA Space Apps Challenge 2025**

Um jogo educativo que utiliza dados reais da NASA para ensinar práticas agrícolas sustentáveis através de decisões estratégicas em um RPG narrativo.

![NASA Farm Navigator](https://img.shields.io/badge/NASA-Space%20Apps%202025-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)

---

## Sobre o Jogo

NASA Farm Navigator é um RPG de texto procedural onde:

- **IA como Mestre**: Narrativas únicas geradas por GPT-4
- **Dados NASA Reais**: Cenários baseados em umidade do solo, clima e imagens de satélite
- **Decisões Estratégicas**: Balance produção e sustentabilidade
- **Aprendizado Contextual**: Cada escolha ensina sobre agricultura sustentável

### Como Jogar

1. Escolha a localização da sua fazenda no mapa
2. A IA gera cenários baseados em dados NASA reais da região
3. Tome decisões que impactam **Produção** e **Sustentabilidade**
4. Mantenha ambas métricas acima de 20 para continuar
5. Alcance 80+ em ambas para vencer em 20 turnos

---

## Arquitetura

### Stack Tecnológica

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Chart.js
- Axios

**Backend**
- Node.js 20
- Express
- TypeScript
- OpenAI GPT-4
- Node-Cache

**Dados NASA**
- GIBS (Global Imagery Browse Services)
- Crop-CASMA (simulado)
- GLAM (simulado)
- MODIS NDVI (simulado)

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- Chave API OpenAI (para narrativas com IA)

### 1. Clone o repositório

```bash
git clone https://github.com/carvalhocaio/space-apps-challenge.git
cd space-apps-challenge
```

### 2. Configure o Backend

```bash
cd backend
npm install

# Copie o arquivo de exemplo e configure
cp ../.env.example .env

# Edite .env e adicione sua OPENAI_API_KEY
# OPENAI_API_KEY=sk-...
```

### 3. Configure o Frontend

```bash
cd ../frontend
npm install

# Copie o arquivo de exemplo
cp .env.local.example .env.local
```

### 4. Execute o Projeto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Servidor rodando em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App rodando em http://localhost:3000
```

### 5. Acesse o Jogo

Abra seu navegador em: **http://localhost:3000**

---

## Valor Educacional

### O que os Jogadores Aprendem

1. **Dados de Satélite**
   - Como interpretar NDVI (índice de vegetação)
   - Uso de imagens de satélite na agricultura

2. **Gestão Sustentável**
   - Trade-offs entre produção e meio ambiente
   - Importância da conservação do solo
   - Técnicas de irrigação eficientes

3. **Tomada de Decisão**
   - Análise de dados para decisões agrícolas
   - Impacto de longo prazo vs curto prazo
   - Gestão de recursos limitados

4. **Tecnologia na Agricultura**
   - Aplicações práticas de dados NASA
   - Agricultura de precisão
   - Monitoramento climático

---

## API Endpoints

### NASA Endpoints

#### `GET /api/nasa/all-data?lat=-23.55&lon=-46.63`
Retorna todos os dados NASA para uma localização

#### `GET /api/nasa/satellite-image?lat=-23.55&lon=-46.63`
Retorna URL de imagem de satélite

---

## 🏆 NASA Space Apps Challenge 2025

Este projeto foi desenvolvido para o [NASA Space Apps Challenge 2025](https://www.spaceappschallenge.org/2025/challenges/nasa-farm-navigators-using-nasa-data-exploration-in-agriculture/).

**Desafio**: Navegadores Agrícolas da NASA - Usando a Exploração de Dados da NASA na Agricultura

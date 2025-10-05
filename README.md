# 🌱 NASA Farm Navigator

**RPG de Texto Educativo | NASA Space Apps Challenge 2025**

Um jogo educativo que utiliza dados reais da NASA para ensinar práticas agrícolas sustentáveis através
de decisões estratégicas em um RPG narrativo.

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
- **Eventos Aleatórios**: Enfrente desafios climáticos inesperados (secas, geadas, pragas)
- **Sistema de Recursos**: Gerencie água, fertilizantes, sementes e dinheiro
- **Aprendizado Contextual**: Cada escolha ensina sobre agricultura sustentável

### Como Jogar

1. Escolha a localização da sua fazenda no mapa (5 regiões disponíveis)
2. Dê um nome à sua fazenda e comece a aventura
3. A IA gera cenários baseados em dados NASA reais da região
4. Tome decisões que impactam **Produção** e **Sustentabilidade**
5. Gerencie recursos na **Loja da Fazenda** (água, fertilizantes, sementes)
6. Enfrente **3 eventos aleatórios** durante os 20 turnos
7. Mantenha ambas métricas acima de 20 para continuar

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

## 🎯 Mecânicas de Jogo

### Sistema de Métricas
- **Produção**: Representa eficiência e quantidade de colheita
- **Sustentabilidade**: Saúde do solo, biodiversidade e impacto ambiental
- Ambas começam em 20 pontos e podem variar de 0 a 100

### Sistema de Recursos
- **Água**: Necessária para irrigação e cultivo
- **Fertilizante**: Melhora produtividade das plantações
- **Sementes**: Base para novas culturas
- **Dinheiro**: Ganho por produção, usado para comprar recursos

### Loja da Fazenda
- Compre recursos durante o jogo
- Preços: Água (R$10), Fertilizante (R$15), Sementes (R$20)
- Limite máximo de 100 unidades por recurso

### Eventos Aleatórios
Durante os 20 turnos, **3 eventos aleatórios** podem ocorrer:

**Eventos Climáticos**: Seca, geada, chuvas intensas, onda de calor, granizo, vendaval
**Pragas**: Gafanhotos, doenças fúngicas
**Eventos de Mercado**: Queda nos preços
**Eventos Naturais**: Erosão do solo

Cada evento reduz entre 5-18 pontos nas métricas, simulando a imprevisibilidade da agricultura real.

### Localizações Disponíveis
1. **São Paulo, Brasil** - Clima subtropical, Mata Atlântica
2. **Iowa, EUA** - Cinturão de milho e soja, pradaria temperada
3. **Punjab, Índia** - Monções, região Indo-Gangética
4. **Pampas, Argentina** - Zona de grãos, clima temperado
5. **Vale do Nilo, Egito** - Agricultura irrigada, clima desértico

Cada região possui características únicas de solo, clima e desafios específicos.

---

## Valor Educacional

### O que os Jogadores Aprendem

1. **Dados de Satélite**
   - Como interpretar NDVI (índice de vegetação)
   - Uso de imagens de satélite na agricultura
   - Análise de umidade do solo por sensoriamento remoto

2. **Gestão Sustentável**
   - Trade-offs entre produção e meio ambiente
   - Importância da conservação do solo
   - Técnicas de irrigação eficientes (gotejamento vs intensiva)
   - Impacto da agricultura orgânica vs química

3. **Tomada de Decisão**
   - Análise de dados para decisões agrícolas
   - Impacto de longo prazo vs curto prazo
   - Gestão de recursos limitados
   - Adaptação a eventos climáticos inesperados

4. **Tecnologia na Agricultura**
   - Aplicações práticas de dados NASA
   - Agricultura de precisão
   - Monitoramento climático
   - Diversidade de biomas e adaptações regionais

---

## 🏆 NASA Space Apps Challenge 2025

Este projeto foi desenvolvido para o [NASA Space Apps Challenge 2025](https://www.spaceappschallenge.org/2025/challenges/nasa-farm-navigators-using-nasa-data-exploration-in-agriculture/).

**Desafio**: Navegadores Agrícolas da NASA - Usando a Exploração de Dados da NASA na Agricultura

import OpenAI from 'openai';
import { config } from '../config/env';
import { GameState, GameScenario, NASAData } from '../../../shared/types/game-state';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey || 'fallback',
    });
  }

  /**
   * Gerar cenário de jogo usando GPT-4
   */
  async generateScenario(gameState: GameState, nasaData: NASAData): Promise<GameScenario> {
    if (!config.openaiApiKey) {
      return this.generateFallbackScenario(gameState, nasaData);
    }

    try {
      const prompt = this.buildPrompt(gameState, nasaData);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Modelo mais recente que suporta JSON mode e é mais barato
        messages: [
          {
            role: 'system',
            content: `Você é um mestre de RPG especializado em agricultura sustentável.
Crie cenários educativos baseados em dados reais da NASA.
Use linguagem clara e acessível em português brasileiro.
Sempre explique o contexto científico dos dados NASA de forma educativa.
Cada opção deve ter impactos claros em produção e sustentabilidade.
IMPORTANTE: Responda SEMPRE em formato JSON válido.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      const parsed = JSON.parse(response);
      return this.validateAndFormatScenario(parsed, nasaData);
    } catch (error) {
      console.error('Error generating scenario with OpenAI:', error);
      return this.generateFallbackScenario(gameState, nasaData);
    }
  }

  /**
   * Construir prompt para a OpenAI
   */
  private buildPrompt(gameState: GameState, nasaData: NASAData): string {
    const lastDecision = gameState.history[gameState.history.length - 1];
    const previousContext = lastDecision
      ? `\n\nÚltima decisão do jogador: ${lastDecision.description} (Turno ${lastDecision.turn})`
      : '';

    return `
Gere um cenário de jogo para o turno ${gameState.turn} de ${gameState.maxTurns}.

FAZENDA: ${gameState.farmName}
LOCALIZAÇÃO: Lat ${gameState.farmLocation.lat.toFixed(2)}, Lon ${gameState.farmLocation.lon.toFixed(2)}

MÉTRICAS ATUAIS:
- Produção: ${gameState.metrics.production}/100
- Sustentabilidade: ${gameState.metrics.sustainability}/100

RECURSOS:
- Água: ${gameState.resources.water}
- Fertilizante: ${gameState.resources.fertilizer}
- Sementes: ${gameState.resources.seeds}
- Dinheiro: R$ ${gameState.resources.money}

DADOS NASA (REAIS):
- Umidade do Solo: ${nasaData.soilMoisture.toFixed(1)}%
- Temperatura: ${nasaData.temperature}°C
- Precipitação: ${nasaData.precipitation}mm
- Índice de Vegetação (NDVI): ${nasaData.vegetationIndex.toFixed(2)}
${previousContext}

TAREFA:
Crie um cenário agrícola realista que:
1. Use os dados NASA para contextualizar a situação
2. Apresente 2-3 opções de decisão
3. Cada opção deve ter impactos claros em produção/sustentabilidade
4. Inclua explicação educativa dos dados NASA

FORMATO JSON (obrigatório):
{
  "narrative": "Descrição do cenário (2-3 parágrafos)",
  "nasaContext": "Explicação educativa dos dados NASA e seu impacto",
  "options": [
    {
      "id": "A",
      "description": "Descrição da opção",
      "impacts": {
        "production": -10 a +15,
        "sustainability": -10 a +15
      },
      "educational": "Por que essa decisão tem esses impactos",
      "resourceCost": {
        "water": 0-50,
        "fertilizer": 0-50,
        "seeds": 0-30,
        "money": 0-500
      }
    }
  ]
}

IMPORTANTE:
- Impacts devem somar próximo de zero para balanceamento
- Cada opção deve ensinar algo sobre agricultura sustentável
- Use dados NASA de forma educativa, não decorativa
`;
  }

  /**
   * Validar e formatar resposta da OpenAI
   */
  private validateAndFormatScenario(parsed: any, nasaData: NASAData): GameScenario {
    return {
      narrative: parsed.narrative || 'Cenário não disponível',
      nasaContext: parsed.nasaContext || '',
      nasaData,
      options: parsed.options || [],
    };
  }

  /**
   * Gerar cenário fallback (quando OpenAI não está disponível)
   */
  private generateFallbackScenario(gameState: GameState, nasaData: NASAData): GameScenario {
    const scenarios = [
      {
        narrative: `Turno ${gameState.turn}: Os dados de satélite da NASA mostram que sua região está em um período de ${nasaData.soilMoisture > 60 ? 'alta umidade' : 'baixa umidade'} no solo. A temperatura está em ${nasaData.temperature}°C e a precipitação prevista é de ${nasaData.precipitation}mm. O índice de vegetação (NDVI) está em ${nasaData.vegetationIndex.toFixed(2)}, indicando ${nasaData.vegetationIndex > 0.6 ? 'boa' : 'moderada'} saúde das plantas.`,
        nasaContext: `O NDVI (Normalized Difference Vegetation Index) é medido por satélites NASA e indica a saúde da vegetação. Valores acima de 0.6 indicam plantas saudáveis. A umidade do solo é crucial para decidir sobre irrigação - valores abaixo de 40% indicam necessidade de água.`,
        options: [
          {
            id: 'A',
            description: 'Irrigar intensivamente as culturas',
            impacts: { production: 15, sustainability: -10 },
            educational: 'Irrigação intensiva aumenta produção no curto prazo, mas pode esgotar recursos hídricos e degradar o solo a longo prazo.',
            resourceCost: { water: 30, money: 200 },
          },
          {
            id: 'B',
            description: 'Implementar sistema de irrigação por gotejamento',
            impacts: { production: 8, sustainability: 12 },
            educational: 'Irrigação por gotejamento economiza água (até 60%) e melhora sustentabilidade, mas requer investimento inicial.',
            resourceCost: { water: 15, money: 350 },
          },
          {
            id: 'C',
            description: 'Plantar culturas resistentes à seca',
            impacts: { production: -5, sustainability: 15 },
            educational: 'Culturas adaptadas ao clima local reduzem necessidade de irrigação e são mais resilientes a mudanças climáticas.',
            resourceCost: { seeds: 20, money: 150 },
          },
        ],
      },
      {
        narrative: `Turno ${gameState.turn}: Os satélites NASA detectaram mudanças nas condições climáticas. Com temperatura de ${nasaData.temperature}°C e precipitação de ${nasaData.precipitation}mm, você precisa decidir sobre o manejo do solo. A umidade atual está em ${nasaData.soilMoisture.toFixed(1)}%.`,
        nasaContext: `A precipitação e temperatura são dados coletados por satélites meteorológicos da NASA. Esses dados ajudam a prever necessidades de irrigação e escolher práticas adequadas de manejo do solo.`,
        options: [
          {
            id: 'A',
            description: 'Aplicar fertilizante químico para rápido crescimento',
            impacts: { production: 20, sustainability: -15 },
            educational: 'Fertilizantes químicos aumentam produção rapidamente, mas podem contaminar lençóis freáticos e degradar biodiversidade do solo.',
            resourceCost: { fertilizer: 40, money: 300 },
          },
          {
            id: 'B',
            description: 'Usar compostagem e adubação orgânica',
            impacts: { production: 5, sustainability: 18 },
            educational: 'Adubação orgânica melhora estrutura do solo, retém água e promove biodiversidade, mas tem efeito mais lento.',
            resourceCost: { fertilizer: 20, money: 150 },
          },
        ],
      },
    ];

    const scenario = scenarios[gameState.turn % scenarios.length];
    return {
      ...scenario,
      nasaData,
    };
  }
}

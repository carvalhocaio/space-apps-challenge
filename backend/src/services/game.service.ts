import { v4 as uuidv4 } from 'uuid';
import {
  GameState,
  GameScenario,
  Coordinates,
  GAME_CONSTANTS,
  Decision,
  Achievement,
} from '../../../shared/types/game-state';
import { NASAService } from './nasa.service';
import { OpenAIService } from './openai.service';

export class GameService {
  private nasaService: NASAService;
  private openaiService: OpenAIService;

  constructor() {
    this.nasaService = new NASAService();
    this.openaiService = new OpenAIService();
  }

  /**
   * Iniciar novo jogo
   */
  async startNewGame(farmLocation: Coordinates, farmName: string): Promise<GameState> {
    const gameState: GameState = {
      id: uuidv4(),
      turn: 1,
      maxTurns: GAME_CONSTANTS.DEFAULT_MAX_TURNS,
      metrics: {
        production: GAME_CONSTANTS.INITIAL_PRODUCTION,
        sustainability: GAME_CONSTANTS.INITIAL_SUSTAINABILITY,
      },
      farmLocation,
      farmName,
      history: [],
      resources: { ...GAME_CONSTANTS.INITIAL_RESOURCES },
      achievements: [],
      isGameOver: false,
      isVictory: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return gameState;
  }

  /**
   * Gerar cenário para o turno atual
   */
  async generateScenario(gameState: GameState): Promise<GameScenario> {
    const nasaData = await this.nasaService.getAllNASAData(
      gameState.farmLocation.lat,
      gameState.farmLocation.lon
    );

    const scenario = await this.openaiService.generateScenario(gameState, nasaData);

    // Adicionar imagens de satélite (múltiplas camadas)
    const satelliteImages = await this.nasaService.getSatelliteImage(
      gameState.farmLocation.lat,
      gameState.farmLocation.lon
    );

    return {
      ...scenario,
      imageUrl: satelliteImages.trueColor, // Compatibilidade retroativa
      satelliteImages,
    };
  }

  /**
   * Verificar se o jogador tem recursos suficientes para uma opção
   */
  private hasEnoughResources(resources: any, cost?: Partial<any>): { hasEnough: boolean; missing: string[] } {
    if (!cost) return { hasEnough: true, missing: [] };

    const missing: string[] = [];

    if (cost.water && resources.water < cost.water) {
      missing.push(`Água (faltam ${cost.water - resources.water})`);
    }
    if (cost.fertilizer && resources.fertilizer < cost.fertilizer) {
      missing.push(`Fertilizante (faltam ${cost.fertilizer - resources.fertilizer})`);
    }
    if (cost.seeds && resources.seeds < cost.seeds) {
      missing.push(`Sementes (faltam ${cost.seeds - resources.seeds})`);
    }
    if (cost.money && resources.money < cost.money) {
      missing.push(`Dinheiro (faltam R$ ${cost.money - resources.money})`);
    }

    return {
      hasEnough: missing.length === 0,
      missing,
    };
  }

  /**
   * Processar escolha do jogador
   */
  async processChoice(gameState: GameState, optionId: string, selectedOption?: any): Promise<GameState> {
    // Obter dados da NASA para o histórico
    const nasaData = await this.nasaService.getAllNASAData(
      gameState.farmLocation.lat,
      gameState.farmLocation.lon
    );

    // Se a opção não foi fornecida, buscar no cenário (fallback para compatibilidade)
    if (!selectedOption) {
      const scenario = await this.generateScenario(gameState);
      selectedOption = scenario.options.find((opt) => opt.id === optionId);

      if (!selectedOption) {
        throw new Error(`Invalid option ID: ${optionId}`);
      }
    }

    // Validar recursos antes de processar
    const { hasEnough, missing } = this.hasEnoughResources(
      gameState.resources,
      selectedOption.resourceCost
    );

    if (!hasEnough) {
      throw new Error(`Recursos insuficientes: ${missing.join(', ')}`);
    }

    // Clonar estado
    const updatedState = { ...gameState };

    // Aplicar impactos nas métricas
    updatedState.metrics = {
      production: this.clampMetric(
        updatedState.metrics.production + selectedOption.impacts.production
      ),
      sustainability: this.clampMetric(
        updatedState.metrics.sustainability + selectedOption.impacts.sustainability
      ),
    };

    // Aplicar custos de recursos
    if (selectedOption.resourceCost) {
      updatedState.resources = {
        water: Math.max(
          0,
          updatedState.resources.water - (selectedOption.resourceCost.water || 0)
        ),
        fertilizer: Math.max(
          0,
          updatedState.resources.fertilizer - (selectedOption.resourceCost.fertilizer || 0)
        ),
        seeds: Math.max(
          0,
          updatedState.resources.seeds - (selectedOption.resourceCost.seeds || 0)
        ),
        money: Math.max(
          0,
          updatedState.resources.money - (selectedOption.resourceCost.money || 0)
        ),
      };
    }

    // Adicionar ganho de recursos baseado em produção
    const productionIncome = Math.floor(updatedState.metrics.production * 5);
    updatedState.resources.money += productionIncome;

    // Registrar decisão no histórico
    const decision: Decision = {
      turn: updatedState.turn,
      optionId,
      description: selectedOption.description,
      impacts: selectedOption.impacts,
      nasaData: nasaData,
      timestamp: new Date(),
    };
    updatedState.history.push(decision);

    // Verificar conquistas
    const newAchievements = this.checkAchievements(updatedState);
    updatedState.achievements.push(...newAchievements);

    // Avançar turno
    updatedState.turn += 1;
    updatedState.updatedAt = new Date();

    // Verificar condições de fim de jogo
    this.checkGameOver(updatedState);

    return updatedState;
  }

  /**
   * Limitar métricas entre 0-100
   */
  private clampMetric(value: number): number {
    return Math.max(
      GAME_CONSTANTS.MIN_METRIC_VALUE,
      Math.min(GAME_CONSTANTS.MAX_METRIC_VALUE, value)
    );
  }

  /**
   * Verificar condições de Game Over ou Vitória
   */
  private checkGameOver(gameState: GameState): void {
    const { production, sustainability } = gameState.metrics;

    // Game Over: qualquer métrica < 20
    if (
      production < GAME_CONSTANTS.GAME_OVER_THRESHOLD ||
      sustainability < GAME_CONSTANTS.GAME_OVER_THRESHOLD
    ) {
      gameState.isGameOver = true;
      gameState.isVictory = false;
      return;
    }

    // Vitória: ambas métricas >= 80 ao final
    if (gameState.turn > gameState.maxTurns) {
      gameState.isGameOver = true;

      if (
        production >= GAME_CONSTANTS.VICTORY_THRESHOLD &&
        sustainability >= GAME_CONSTANTS.VICTORY_THRESHOLD
      ) {
        gameState.isVictory = true;
      } else {
        gameState.isVictory = false;
      }
    }
  }

  /**
   * Verificar e desbloquear conquistas
   */
  private checkAchievements(gameState: GameState): Achievement[] {
    const achievements: Achievement[] = [];
    const existingIds = new Set(gameState.achievements.map((a) => a.id));

    // Primeira vitória sustentável
    if (
      !existingIds.has('first_sustainable') &&
      gameState.metrics.sustainability >= 80
    ) {
      achievements.push({
        id: 'first_sustainable',
        title: 'Fazendeiro Sustentável',
        description: 'Alcançou 80 pontos de sustentabilidade',
        unlockedAt: new Date(),
      });
    }

    // Primeira alta produção
    if (!existingIds.has('first_productive') && gameState.metrics.production >= 80) {
      achievements.push({
        id: 'first_productive',
        title: 'Produtor Eficiente',
        description: 'Alcançou 80 pontos de produção',
        unlockedAt: new Date(),
      });
    }

    // Equilíbrio perfeito
    if (
      !existingIds.has('perfect_balance') &&
      gameState.metrics.production >= 70 &&
      gameState.metrics.sustainability >= 70
    ) {
      achievements.push({
        id: 'perfect_balance',
        title: 'Equilíbrio Perfeito',
        description: 'Manteve ambas métricas acima de 70',
        unlockedAt: new Date(),
      });
    }

    // Sobrevivente
    if (!existingIds.has('survivor') && gameState.turn >= 10) {
      achievements.push({
        id: 'survivor',
        title: 'Sobrevivente',
        description: 'Completou 10 turnos',
        unlockedAt: new Date(),
      });
    }

    return achievements;
  }

  /**
   * Obter estatísticas do jogo
   */
  getGameStats(gameState: GameState) {
    const avgProduction =
      gameState.history.reduce((sum, d) => {
        const prevProd = gameState.metrics.production - d.impacts.production;
        return sum + prevProd;
      }, gameState.metrics.production) / (gameState.history.length + 1);

    const avgSustainability =
      gameState.history.reduce((sum, d) => {
        const prevSust = gameState.metrics.sustainability - d.impacts.sustainability;
        return sum + prevSust;
      }, gameState.metrics.sustainability) / (gameState.history.length + 1);

    const totalProductionGain = gameState.history.reduce(
      (sum, d) => sum + Math.max(0, d.impacts.production),
      0
    );

    const totalSustainabilityGain = gameState.history.reduce(
      (sum, d) => sum + Math.max(0, d.impacts.sustainability),
      0
    );

    return {
      avgProduction: avgProduction.toFixed(1),
      avgSustainability: avgSustainability.toFixed(1),
      totalProductionGain,
      totalSustainabilityGain,
      decisionsCount: gameState.history.length,
      achievementsCount: gameState.achievements.length,
      finalScore:
        (gameState.metrics.production + gameState.metrics.sustainability) / 2,
    };
  }
}

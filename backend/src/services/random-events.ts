import { RandomEvent, LocationProfile } from '../../../shared/types/game-state';

interface EventTemplate {
  id: string;
  name: string;
  description: string;
  impacts: {
    production: number;
    sustainability: number;
  };
  type: 'climate' | 'plague' | 'market' | 'natural';
}

export class RandomEventsService {
  // Pool de eventos aleatórios
  private eventPool: EventTemplate[] = [
    {
      id: 'drought',
      name: 'Seca Repentina',
      description: 'Uma onda de calor inesperada reduziu drasticamente a umidade do solo. As plantas estão sofrendo com a falta de água e a produção foi afetada.',
      impacts: { production: -12, sustainability: -8 },
      type: 'climate',
    },
    {
      id: 'frost',
      name: 'Geada Inesperada',
      description: 'Uma frente fria trouxe geada durante a noite, danificando parte das culturas. Algumas plantas não resistiram às baixas temperaturas.',
      impacts: { production: -15, sustainability: -5 },
      type: 'climate',
    },
    {
      id: 'plague_locusts',
      name: 'Infestação de Gafanhotos',
      description: 'Um enxame de gafanhotos passou pela região, consumindo parte da vegetação. A produção foi severamente afetada neste ciclo.',
      impacts: { production: -18, sustainability: -10 },
      type: 'plague',
    },
    {
      id: 'hailstorm',
      name: 'Tempestade de Granizo',
      description: 'Uma tempestade severa com granizo danificou as plantações. Algumas culturas foram perdidas, mas o solo recebeu água.',
      impacts: { production: -14, sustainability: -6 },
      type: 'climate',
    },
    {
      id: 'heatwave',
      name: 'Onda de Calor',
      description: 'Temperaturas extremamente altas afetaram o desenvolvimento das plantas. A evapotranspiração aumentou, estressando as culturas.',
      impacts: { production: -10, sustainability: -12 },
      type: 'climate',
    },
    {
      id: 'plague_fungus',
      name: 'Doença Fúngica',
      description: 'Alta umidade favoreceu o desenvolvimento de fungos nas plantações. Algumas culturas foram contaminadas e precisaram ser descartadas.',
      impacts: { production: -13, sustainability: -7 },
      type: 'plague',
    },
    {
      id: 'heavy_rain',
      name: 'Chuvas Intensas',
      description: 'Precipitação acima do normal causou alagamento em partes da fazenda. Algumas áreas ficaram encharcadas, afetando as raízes das plantas.',
      impacts: { production: -9, sustainability: -11 },
      type: 'climate',
    },
    {
      id: 'wind_storm',
      name: 'Vendaval',
      description: 'Ventos fortes derrubaram algumas plantas e danificaram estruturas. A erosão do solo em áreas expostas foi intensificada.',
      impacts: { production: -11, sustainability: -9 },
      type: 'natural',
    },
    {
      id: 'price_drop',
      name: 'Queda nos Preços',
      description: 'O mercado foi inundado por produtos similares, causando uma queda nos preços. A receita desta temporada será menor que o esperado.',
      impacts: { production: -8, sustainability: -5 },
      type: 'market',
    },
    {
      id: 'soil_erosion',
      name: 'Erosão do Solo',
      description: 'Chuvas mal distribuídas e práticas inadequadas causaram erosão em algumas áreas. A qualidade do solo foi comprometida.',
      impacts: { production: -7, sustainability: -15 },
      type: 'natural',
    },
  ];

  /**
   * Sortear 3 turnos aleatórios para eventos (entre turno 2 e 18)
   */
  scheduleRandomEvents(maxTurns: number): number[] {
    const minTurn = 2;
    const maxTurn = Math.min(18, maxTurns - 2); // Evitar últimos 2 turnos
    const availableTurns = Array.from(
      { length: maxTurn - minTurn + 1 },
      (_, i) => i + minTurn
    );

    // Embaralhar e pegar 3 turnos
    const shuffled = availableTurns.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).sort((a, b) => a - b);
  }

  /**
   * Selecionar evento aleatório baseado em contexto (opcional)
   */
  selectRandomEvent(
    location?: { avgTemperature: number; avgPrecipitation: number }
  ): EventTemplate {
    let filteredEvents = [...this.eventPool];

    // Contexto climático (opcional): regiões quentes têm mais chance de ondas de calor
    if (location) {
      if (location.avgTemperature > 25) {
        // Aumentar peso de eventos de calor/seca
        const heatEvents = this.eventPool.filter(
          (e) => e.id === 'drought' || e.id === 'heatwave'
        );
        filteredEvents = [...filteredEvents, ...heatEvents];
      }

      if (location.avgPrecipitation < 500) {
        // Regiões áridas: mais secas
        const droughtEvents = this.eventPool.filter((e) => e.id === 'drought');
        filteredEvents = [...filteredEvents, ...droughtEvents];
      }

      if (location.avgPrecipitation > 1200) {
        // Regiões úmidas: mais chuvas/fungos
        const wetEvents = this.eventPool.filter(
          (e) => e.id === 'heavy_rain' || e.id === 'plague_fungus'
        );
        filteredEvents = [...filteredEvents, ...wetEvents];
      }
    }

    // Selecionar aleatoriamente
    const randomIndex = Math.floor(Math.random() * filteredEvents.length);
    return filteredEvents[randomIndex];
  }

  /**
   * Gerar evento completo para um turno específico
   */
  generateEvent(
    turn: number,
    location?: { avgTemperature: number; avgPrecipitation: number }
  ): RandomEvent {
    const template = this.selectRandomEvent(location);

    return {
      id: `${template.id}_turn${turn}`,
      name: template.name,
      description: template.description,
      impacts: { ...template.impacts },
      type: template.type,
      turn,
      timestamp: new Date(),
    };
  }
}

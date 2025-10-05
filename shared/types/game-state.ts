export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LocationProfile {
  name: string;
  coordinates: Coordinates;
  soilType: string;        // Tipo de solo (ex: Latossolo, Argiloso, Arenoso)
  climate: string;          // Clima (ex: Tropical, Temperado, Árido)
  vegetation: string;       // Vegetação nativa
  biome: string;           // Bioma (ex: Cerrado, Pampa, Deserto)
  avgTemperature: number;  // Temperatura média anual (°C)
  avgPrecipitation: number; // Precipitação média anual (mm)
  waterAvailability: 'low' | 'medium' | 'high'; // Disponibilidade hídrica
  challenges: string[];    // Desafios específicos da região
}

export interface GameMetrics {
  production: number;      // 0-100
  sustainability: number;  // 0-100
}

export interface Resources {
  water: number;
  fertilizer: number;
  seeds: number;
  money: number;
}

export interface Decision {
  turn: number;
  optionId: string;
  description: string;
  impacts: {
    production: number;
    sustainability: number;
  };
  nasaData: NASAData;
  timestamp: Date;
}

export interface NASAData {
  soilMoisture: number;      // Percentual 0-100
  temperature: number;       // Celsius
  precipitation: number;     // mm
  vegetationIndex: number;   // NDVI 0-1
  source: string;            // Nome da API/dataset
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  impacts: {
    production: number;
    sustainability: number;
  };
  type: 'climate' | 'plague' | 'market' | 'natural';
  turn: number;
  timestamp: Date;
}

export interface GameState {
  id: string;
  turn: number;
  maxTurns: number;
  metrics: GameMetrics;
  farmLocation: Coordinates;
  farmName: string;
  history: Decision[];
  resources: Resources;
  achievements: Achievement[];
  randomEvents: RandomEvent[];
  scheduledEventTurns: number[];
  isGameOver: boolean;
  isVictory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameOption {
  id: string;
  description: string;
  impacts: {
    production: number;
    sustainability: number;
  };
  educational: string;
  resourceCost?: Partial<Resources>;
}

export interface SatelliteImages {
  trueColor: string;
  ndvi: string;
  temperature: string;
}

export interface GameScenario {
  narrative: string;
  nasaContext: string;
  nasaData: NASAData;
  options: GameOption[];
  imageUrl?: string; // Deprecated - mantido para compatibilidade
  satelliteImages?: SatelliteImages;
}

export interface GameResponse {
  success: boolean;
  gameState: GameState;
  scenario?: GameScenario;
  randomEvent?: RandomEvent;
  message?: string;
}

export const GAME_CONSTANTS = {
  MIN_METRIC_VALUE: 0,
  MAX_METRIC_VALUE: 100,
  GAME_OVER_THRESHOLD: 20,
  VICTORY_THRESHOLD: 80,
  DEFAULT_MAX_TURNS: 20,
  INITIAL_PRODUCTION: 20,
  INITIAL_SUSTAINABILITY: 20,
  INITIAL_RESOURCES: {
    water: 100,
    fertilizer: 100,
    seeds: 100,
    money: 1000,
  },
  RESOURCE_PRICES: {
    water: 10,
    fertilizer: 15,
    seeds: 20,
  },
  MAX_RESOURCE_VALUE: 100,
} as const;

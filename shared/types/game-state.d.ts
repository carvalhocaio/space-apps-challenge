export interface Coordinates {
    lat: number;
    lon: number;
}
export interface GameMetrics {
    production: number;
    sustainability: number;
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
    soilMoisture: number;
    temperature: number;
    precipitation: number;
    vegetationIndex: number;
    source: string;
}
export interface Achievement {
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
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
    imageUrl?: string;
    satelliteImages?: SatelliteImages;
}
export interface GameResponse {
    success: boolean;
    gameState: GameState;
    scenario?: GameScenario;
    message?: string;
}
export declare const GAME_CONSTANTS: {
    readonly MIN_METRIC_VALUE: 0;
    readonly MAX_METRIC_VALUE: 100;
    readonly GAME_OVER_THRESHOLD: 20;
    readonly VICTORY_THRESHOLD: 80;
    readonly DEFAULT_MAX_TURNS: 20;
    readonly INITIAL_PRODUCTION: 50;
    readonly INITIAL_SUSTAINABILITY: 50;
    readonly INITIAL_RESOURCES: {
        readonly water: 100;
        readonly fertilizer: 100;
        readonly seeds: 100;
        readonly money: 1000;
    };
};
//# sourceMappingURL=game-state.d.ts.map
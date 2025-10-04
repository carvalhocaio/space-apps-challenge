import axios from 'axios';
import { GameState, GameResponse, Coordinates } from '../../../shared/types/game-state';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameApi = {
  /**
   * Iniciar novo jogo
   */
  async startGame(farmLocation: Coordinates, farmName: string): Promise<GameResponse> {
    const response = await api.post('/api/game/start', { farmLocation, farmName });
    return response.data;
  },

  /**
   * Fazer uma escolha
   */
  async makeChoice(gameState: GameState, optionId: string): Promise<GameResponse> {
    const response = await api.post('/api/game/choice', { gameState, optionId });
    return response.data;
  },

  /**
   * Obter estatísticas do jogo
   */
  async getStats(gameState: GameState) {
    const response = await api.post('/api/game/stats', { gameState });
    return response.data;
  },
};

export const nasaApi = {
  /**
   * Obter dados de umidade do solo
   */
  async getSoilMoisture(lat: number, lon: number) {
    const response = await api.get('/api/nasa/soil-moisture', {
      params: { lat, lon },
    });
    return response.data;
  },

  /**
   * Obter dados climáticos
   */
  async getClimateData(lat: number, lon: number) {
    const response = await api.get('/api/nasa/climate', {
      params: { lat, lon },
    });
    return response.data;
  },

  /**
   * Obter imagem de satélite
   */
  async getSatelliteImage(lat: number, lon: number, date?: string) {
    const response = await api.get('/api/nasa/satellite-image', {
      params: { lat, lon, date },
    });
    return response.data;
  },

  /**
   * Obter todos os dados NASA
   */
  async getAllData(lat: number, lon: number) {
    const response = await api.get('/api/nasa/all-data', {
      params: { lat, lon },
    });
    return response.data;
  },
};

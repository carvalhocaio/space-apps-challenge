import NodeCache from 'node-cache';
import { NASAData } from '../../../shared/types/game-state';

export class NASAService {
  private cache: NodeCache;

  constructor() {
    // Cache com TTL de 5 minutos
    this.cache = new NodeCache({ stdTTL: 300 });
  }

  private getCacheKey(prefix: string, lat: number, lon: number): string {
    return `${prefix}_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  }

  /**
   * Obter dados de umidade do solo
   * Nota: Esta é uma simulação baseada em padrões climáticos
   * Em produção, usar API real como SMAP ou Crop-CASMA
   */
  async getSoilMoisture(lat: number, lon: number): Promise<number> {
    const cacheKey = this.getCacheKey('soil', lat, lon);
    const cached = this.cache.get<number>(cacheKey);

    if (cached !== undefined) {
      return cached;
    }

    try {
      // Simulação: varia com latitude (mais úmido perto do equador)
      // Em produção, usar: https://nassgeo.csiss.gmu.edu/CropCASMA/api
      const baseValue = 50;
      const latFactor = Math.abs(lat) < 30 ? 20 : -10;
      const randomFactor = Math.random() * 20 - 10;
      const soilMoisture = Math.max(10, Math.min(90, baseValue + latFactor + randomFactor));

      this.cache.set(cacheKey, soilMoisture);
      return soilMoisture;
    } catch (error) {
      console.error('Error getting soil moisture:', error);
      return 50; // Fallback
    }
  }

  /**
   * Obter dados climáticos (temperatura e precipitação)
   * Simulação baseada em latitude
   */
  async getClimateData(lat: number, lon: number): Promise<{ temperature: number; precipitation: number }> {
    const cacheKey = this.getCacheKey('climate', lat, lon);
    const cached = this.cache.get<{ temperature: number; precipitation: number }>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Simulação baseada em latitude
      // Temperatura: mais quente perto do equador
      const baseTemp = 25;
      const latTempFactor = -Math.abs(lat) * 0.5;
      const temperature = Math.round(baseTemp + latTempFactor + (Math.random() * 10 - 5));

      // Precipitação: mais alta perto do equador e em zonas específicas
      const basePrecip = Math.abs(lat) < 30 ? 80 : 40;
      const precipitation = Math.round(basePrecip + (Math.random() * 40 - 20));

      const data = { temperature, precipitation };
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error getting climate data:', error);
      return { temperature: 25, precipitation: 50 }; // Fallback
    }
  }

  /**
   * Obter índice de vegetação (NDVI simulado)
   */
  async getVegetationIndex(lat: number, lon: number): Promise<number> {
    const cacheKey = this.getCacheKey('ndvi', lat, lon);
    const cached = this.cache.get<number>(cacheKey);

    if (cached !== undefined) {
      return cached;
    }

    try {
      // NDVI: 0-1, mais alto = mais vegetação
      // Simulação baseada em umidade do solo
      const soilMoisture = await this.getSoilMoisture(lat, lon);
      const ndvi = (soilMoisture / 100) * 0.8 + Math.random() * 0.2;

      this.cache.set(cacheKey, ndvi);
      return Math.min(1, Math.max(0, ndvi));
    } catch (error) {
      console.error('Error getting NDVI:', error);
      return 0.5; // Fallback
    }
  }

  /**
   * Obter URL de imagem de satélite para uma camada específica
   * Utiliza NASA GIBS WMS (Web Map Service)
   */
  private async getSatelliteImageLayer(
    lat: number,
    lon: number,
    layer: string,
    date?: string
  ): Promise<string> {
    // Calcular bounding box ao redor do ponto
    const buffer = 2; // graus de latitude/longitude
    const bbox = `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`;

    // Parâmetros WMS
    const params = new URLSearchParams({
      SERVICE: 'WMS',
      REQUEST: 'GetMap',
      VERSION: '1.3.0',
      LAYERS: layer,
      CRS: 'EPSG:4326',
      BBOX: bbox,
      WIDTH: '512',
      HEIGHT: '512',
      FORMAT: 'image/jpeg',
      TIME: date || new Date().toISOString().split('T')[0],
    });

    return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`;
  }

  /**
   * Obter múltiplas URLs de imagens de satélite com diferentes camadas
   * Retorna True Color, NDVI e Temperature
   */
  async getSatelliteImage(
    lat: number,
    lon: number,
    date?: string
  ): Promise<{ trueColor: string; ndvi: string; temperature: string }> {
    // Usar data de ontem para True Color (delay de 1 dia)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const trueColorDate = date || yesterday.toISOString().split('T')[0];

    // NDVI e Temperature tem delay maior (8 dias)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 8);
    const ndviDate = weekAgo.toISOString().split('T')[0];

    const trueColor = await this.getSatelliteImageLayer(
      lat,
      lon,
      'VIIRS_SNPP_CorrectedReflectance_TrueColor',
      trueColorDate
    );

    const ndvi = await this.getSatelliteImageLayer(
      lat,
      lon,
      'MODIS_Terra_NDVI_8Day',
      ndviDate
    );

    const temperature = await this.getSatelliteImageLayer(
      lat,
      lon,
      'MODIS_Terra_Land_Surface_Temp_Day',
      ndviDate
    );

    console.log('   NASA GIBS Image URLs:');
    console.log('   True Color:', trueColor);
    console.log('   NDVI:', ndvi);
    console.log('   Temperature:', temperature);

    return { trueColor, ndvi, temperature };
  }

  /**
   * Obter todos os dados NASA para uma localização
   */
  async getAllNASAData(lat: number, lon: number): Promise<NASAData> {
    const [soilMoisture, climate, vegetationIndex] = await Promise.all([
      this.getSoilMoisture(lat, lon),
      this.getClimateData(lat, lon),
      this.getVegetationIndex(lat, lon),
    ]);

    return {
      soilMoisture,
      temperature: climate.temperature,
      precipitation: climate.precipitation,
      vegetationIndex,
      source: 'NASA GIBS / Simulated Data',
    };
  }
}

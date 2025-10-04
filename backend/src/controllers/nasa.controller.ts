import { Router, Request, Response } from 'express';
import { NASAService } from '../services/nasa.service';

const router = Router();
const nasaService = new NASAService();

// Obter dados de umidade do solo
router.get('/soil-moisture', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const data = await nasaService.getSoilMoisture(Number(lat), Number(lon));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting soil moisture:', error);
    res.status(500).json({ error: 'Failed to get soil moisture data' });
  }
});

// Obter dados climáticos
router.get('/climate', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const data = await nasaService.getClimateData(Number(lat), Number(lon));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting climate data:', error);
    res.status(500).json({ error: 'Failed to get climate data' });
  }
});

// Obter imagem de satélite
router.get('/satellite-image', async (req: Request, res: Response) => {
  try {
    const { lat, lon, date } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const imageUrl = await nasaService.getSatelliteImage(
      Number(lat),
      Number(lon),
      date as string
    );

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error getting satellite image:', error);
    res.status(500).json({ error: 'Failed to get satellite image' });
  }
});

// Obter todos os dados NASA para uma localização
router.get('/all-data', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const data = await nasaService.getAllNASAData(Number(lat), Number(lon));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting NASA data:', error);
    res.status(500).json({ error: 'Failed to get NASA data' });
  }
});

export default router;

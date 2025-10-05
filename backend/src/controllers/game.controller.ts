import { Router, Request, Response } from 'express';
import { GameService } from '../services/game.service';
import { GameState, Coordinates } from '../../../shared/types/game-state';

const router = Router();
const gameService = new GameService();

// Iniciar novo jogo
router.post('/start', async (req: Request, res: Response) => {
  try {
    const { farmLocation, farmName } = req.body;

    if (!farmLocation || !farmLocation.lat || !farmLocation.lon) {
      return res.status(400).json({ error: 'Farm location is required' });
    }

    const gameState = await gameService.startNewGame(farmLocation, farmName || 'Minha Fazenda');
    const scenario = await gameService.generateScenario(gameState);

    res.json({
      success: true,
      gameState,
      scenario,
    });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Fazer uma escolha
router.post('/choice', async (req: Request, res: Response) => {
  try {
    const { gameState, optionId, selectedOption } = req.body;

    if (!gameState || !optionId) {
      return res.status(400).json({ error: 'Game state and option ID are required' });
    }

    const updatedState = await gameService.processChoice(gameState, optionId, selectedOption);

    if (updatedState.isGameOver) {
      return res.json({
        success: true,
        gameState: updatedState,
        message: updatedState.isVictory ? 'Parabéns! Você venceu!' : 'Game Over',
      });
    }

    const nextScenario = await gameService.generateScenario(updatedState);

    res.json({
      success: true,
      gameState: updatedState,
      scenario: nextScenario,
    });
  } catch (error) {
    console.error('Error processing choice:', error);
    res.status(500).json({ error: 'Failed to process choice' });
  }
});

// Obter estatísticas do jogo
router.post('/stats', async (req: Request, res: Response) => {
  try {
    const { gameState } = req.body;

    if (!gameState) {
      return res.status(400).json({ error: 'Game state is required' });
    }

    const stats = gameService.getGameStats(gameState);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;

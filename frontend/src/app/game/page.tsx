'use client'

import { useState, useEffect } from 'react'
import { GameState, GameScenario, Coordinates } from '../../../../shared/types/game-state'
import { gameApi } from '@/services/api.service'
import MetricsDashboard from '@/components/MetricsDashboard'
import ResourcesPanel from '@/components/ResourcesPanel'
import StoryDisplay from '@/components/StoryDisplay'
import ChoiceButtons from '@/components/ChoiceButtons'
import { MapPin, Home, Trophy, XCircle } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MapContainerComponent = dynamic(() => import("@/components/maps"), { ssr: false });

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [scenario, setScenario] = useState<GameScenario | null>(null)
  const [loading, setLoading] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(true)
  const [farmName, setFarmName] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null)

  // Predefined locations para facilitar
  const locations = [
    { name: 'São Paulo, Brasil', lat: -23.5505, lon: -46.6333 },
    { name: 'Iowa, EUA', lat: 41.8780, lon: -93.0977 },
    { name: 'Punjab, Índia', lat: 31.1471, lon: 75.3412 },
    { name: 'Pampas, Argentina', lat: -34.6037, lon: -58.3816 },
    { name: 'Vale do Nilo, Egito', lat: 26.8206, lon: 30.8025 },
  ]

  const startGame = async () => {
    if (!selectedLocation || !farmName.trim()) {
      alert('Por favor, selecione uma localização e dê um nome à fazenda')
      return
    }

    setLoading(true)
    try {
      const response = await gameApi.startGame(selectedLocation, farmName)
      setGameState(response.gameState)
      setScenario(response.scenario || null)
      setShowLocationPicker(false)
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error)
      alert('Erro ao iniciar o jogo. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const makeChoice = async (optionId: string) => {
    if (!gameState) return

    setLoading(true)
    try {
      const response = await gameApi.makeChoice(gameState, optionId)
      setGameState(response.gameState)

      if (!response.gameState.isGameOver) {
        setScenario(response.scenario || null)
      }
    } catch (error) {
      console.error('Erro ao processar escolha:', error)
      alert('Erro ao processar escolha.')
    } finally {
      setLoading(false)
    }
  }

  // Location Picker Screen
  if (showLocationPicker) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
            <Home className="w-4 h-4" />
            Voltar
          </Link>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurar Fazenda</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Fazenda
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Ex: Fazenda Verde"
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {locations.map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => setSelectedLocation({ lat: loc.lat, lon: loc.lon })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedLocation?.lat === loc.lat && selectedLocation?.lon === loc.lon
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{loc.name}</div>
                          <div className="text-sm text-gray-700 font-medium">
                            {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startGame}
                disabled={loading || !selectedLocation || !farmName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Iniciando...' : 'Começar Jogo'}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Game Over Screen
  if (gameState?.isGameOver) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {gameState.isVictory ? (
              <>
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-green-600 mb-4">Vitória!</h1>
                <p className="text-xl text-gray-700 mb-6">
                  Parabéns! Você conseguiu equilibrar produção e sustentabilidade!
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-red-600 mb-4">Game Over</h1>
                <p className="text-xl text-gray-700 mb-6">
                  Sua fazenda não conseguiu manter o equilíbrio necessário.
                </p>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Produção Final</div>
                <div className="text-3xl font-bold text-blue-600">{gameState.metrics.production}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Sustentabilidade Final</div>
                <div className="text-3xl font-bold text-green-600">{gameState.metrics.sustainability}</div>
              </div>
            </div>

            <div className="text-left mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Conquistas Desbloqueadas:</h3>
              {gameState.achievements.length > 0 ? (
                <ul className="space-y-2">
                  {gameState.achievements.map((achievement) => (
                    <li key={achievement.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-yellow-500">🏆</span>
                      <span className="font-medium">{achievement.title}</span>
                      <span className="text-gray-500">- {achievement.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma conquista desbloqueada.</p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
              >
                Jogar Novamente
              </button>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Main Game Screen
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700">
            <Home className="w-4 h-4" />
            Sair
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{gameState?.farmName}</h1>
        </div>

        <div className="space-y-6">
          {/* Top Row - Metrics & Resources */}
          <div className="grid md:grid-cols-2 gap-6">
            {gameState && (
              <>
                <MetricsDashboard
                  metrics={gameState.metrics}
                  turn={gameState.turn}
                  maxTurns={gameState.maxTurns}
                />
                <ResourcesPanel resources={gameState.resources} />
              </>
            )}
          </div>

          {/* Bottom Row - Story & Choices */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left - Story/Scenario */}
            <div className="lg:col-span-2">
              {scenario && gameState && (
                <StoryDisplay
                  scenario={scenario}
                  farmLocation={gameState.farmLocation}
                  farmName={gameState.farmName}
                />
              )}
              {gameState && (
                <MapContainerComponent lat={gameState.farmLocation.lat} lon={gameState.farmLocation.lon} />
              )}
            </div>

            {/* Right - Choices */}
            <div>
              {scenario && gameState && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ChoiceButtons
                    options={scenario.options}
                    onChoice={makeChoice}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { GameState, GameScenario, LocationProfile } from '../../../../shared/types/game-state'
import { gameApi } from '@/services/api.service'
import MetricsDashboard from '@/components/MetricsDashboard'
import ResourcesPanel from '@/components/ResourcesPanel'
import StoryDisplay from '@/components/StoryDisplay'
import ChoiceButtons from '@/components/ChoiceButtons'
import { MapPin, Home, Trophy, XCircle } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Timer from '@/components/Timer'

const MapContainerComponent = dynamic(() => import("@/components/maps"), { ssr: false });

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [scenario, setScenario] = useState<GameScenario | null>(null)
  const [loading, setLoading] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(true)
  const [farmName, setFarmName] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationProfile | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [finalTime, setFinalTime] = useState<number>(0)

  // Predefined locations com perfis completos
  const locations: LocationProfile[] = [
    {
      name: 'São Paulo, Brasil',
      coordinates: { lat: -23.5505, lon: -46.6333 },
      soilType: 'Latossolo Vermelho',
      climate: 'Subtropical Úmido',
      vegetation: 'Mata Atlântica (remanescente)',
      biome: 'Mata Atlântica',
      avgTemperature: 19,
      avgPrecipitation: 1400,
      waterAvailability: 'medium',
      challenges: ['Chuvas irregulares', 'Solo ácido', 'Degradação urbana']
    },
    {
      name: 'Iowa, EUA',
      coordinates: { lat: 41.8780, lon: -93.0977 },
      soilType: 'Mollisolo (Terra Preta)',
      climate: 'Continental Úmido',
      vegetation: 'Pradaria',
      biome: 'Pradaria Temperada',
      avgTemperature: 9,
      avgPrecipitation: 850,
      waterAvailability: 'high',
      challenges: ['Invernos rigorosos', 'Erosão do solo', 'Monocultura intensiva']
    },
    {
      name: 'Punjab, Índia',
      coordinates: { lat: 31.1471, lon: 75.3412 },
      soilType: 'Aluvial',
      climate: 'Subtropical de Monções',
      vegetation: 'Estepe e pastagens',
      biome: 'Indo-Gangético',
      avgTemperature: 24,
      avgPrecipitation: 700,
      waterAvailability: 'medium',
      challenges: ['Escassez de água subterrânea', 'Salinização do solo', 'Calor extremo']
    },
    {
      name: 'Pampas, Argentina',
      coordinates: { lat: -34.6037, lon: -58.3816 },
      soilType: 'Brunizem',
      climate: 'Temperado Pampeano',
      vegetation: 'Gramíneas nativas',
      biome: 'Pampa',
      avgTemperature: 18,
      avgPrecipitation: 1000,
      waterAvailability: 'high',
      challenges: ['Variabilidade climática', 'Vento forte', 'Compactação do solo']
    },
    {
      name: 'Vale do Nilo, Egito',
      coordinates: { lat: 26.8206, lon: 30.8025 },
      soilType: 'Aluvial Fértil',
      climate: 'Desértico Quente',
      vegetation: 'Vegetação de oásis',
      biome: 'Deserto do Saara',
      avgTemperature: 28,
      avgPrecipitation: 20,
      waterAvailability: 'low',
      challenges: ['Extrema escassez de chuva', 'Dependência do Rio Nilo', 'Desertificação']
    }
  ]

  const startGame = async () => {
    if (!selectedLocation || !farmName.trim()) {
      alert('Por favor, selecione uma localização e dê um nome à fazenda')
      return
    }

    setLoading(true)
    try {
      const response = await gameApi.startGame(selectedLocation.coordinates, farmName)
      setGameState(response.gameState)
      setScenario(response.scenario || null)
      setShowLocationPicker(false)
      setStartTime(Date.now()) // Inicia o temporizador
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error)
      alert('Erro ao iniciar o jogo. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const makeChoice = async (optionId: string) => {
    if (!gameState || !scenario) return

    // Buscar a opção selecionada no cenário atual
    const selectedOption = scenario.options.find(opt => opt.id === optionId)
    if (!selectedOption) {
      console.error('Opção não encontrada:', optionId)
      return
    }

    setLoading(true)
    try {
      const response = await gameApi.makeChoice(gameState, optionId, selectedOption)
      setGameState(response.gameState)

      if (!response.gameState.isGameOver) {
        setScenario(response.scenario || null)
      } else {
        // Salva o tempo final quando o jogo termina
        setFinalTime(Math.floor((Date.now() - startTime) / 1000))
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Configurar Fazenda</h1>
              <button
                onClick={startGame}
                disabled={loading || !selectedLocation || !farmName.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                {loading ? 'Iniciando...' : 'Começar Jogo'}
              </button>
            </div>

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
                <div className="grid md:grid-cols-1 gap-4">
                  {locations.map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => setSelectedLocation(loc)}
                      className={`p-5 rounded-lg border-2 transition-all text-left ${
                        selectedLocation?.name === loc.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-400'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-gray-900">{loc.name}</div>
                              <div className="text-xs text-gray-500">
                                {loc.coordinates.lat.toFixed(2)}, {loc.coordinates.lon.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                            {loc.biome}
                          </span>
                        </div>

                        {/* Properties Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Solo:</span>
                            <span className="ml-2 text-gray-900 font-medium">{loc.soilType}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Clima:</span>
                            <span className="ml-2 text-gray-900 font-medium">{loc.climate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Temp. Média:</span>
                            <span className="ml-2 text-gray-900 font-medium">{loc.avgTemperature}°C</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Chuva Anual:</span>
                            <span className="ml-2 text-gray-900 font-medium">{loc.avgPrecipitation}mm</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Vegetação:</span>
                            <span className="ml-2 text-gray-900 font-medium">{loc.vegetation}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Água:</span>
                            <span className={`ml-2 font-semibold ${
                              loc.waterAvailability === 'high' ? 'text-blue-600' :
                              loc.waterAvailability === 'medium' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {loc.waterAvailability === 'high' ? 'Alta' :
                               loc.waterAvailability === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                          </div>
                        </div>

                        {/* Challenges */}
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Desafios:</div>
                          <div className="flex flex-wrap gap-1">
                            {loc.challenges.map((challenge, idx) => (
                              <span key={idx} className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                                {challenge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Helper function to format time
  const formatFinalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
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

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Produção Final</div>
                <div className="text-3xl font-bold text-blue-600">{gameState.metrics.production}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Sustentabilidade Final</div>
                <div className="text-3xl font-bold text-green-600">{gameState.metrics.sustainability}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Tempo Total</div>
                <div className="text-3xl font-bold text-purple-600">{formatFinalTime(finalTime)}</div>
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
          {startTime > 0 && (
            <Timer startTime={startTime} isGameOver={gameState?.isGameOver || false} />
          )}
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

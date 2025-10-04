'use client'

import { GameScenario } from '../../../shared/types/game-state'
import { Satellite, BookOpen } from 'lucide-react'
import SatelliteMapViewer from './SatelliteMapViewer'

interface StoryDisplayProps {
  scenario: GameScenario
  farmLocation: { lat: number; lon: number }
  farmName: string
}

export default function StoryDisplay({ scenario, farmLocation, farmName }: StoryDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Narrativa Principal */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Cenário</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {scenario.narrative}
        </p>
      </div>

      {/* Contexto NASA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Satellite className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Dados NASA - Contexto Educativo
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              {scenario.nasaContext}
            </p>
          </div>
        </div>
      </div>

      {/* Dados NASA em Destaque */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Umidade do Solo</div>
          <div className="text-lg font-bold text-blue-600">
            {scenario.nasaData.soilMoisture.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Temperatura</div>
          <div className="text-lg font-bold text-orange-600">
            {scenario.nasaData.temperature}°C
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Precipitação</div>
          <div className="text-lg font-bold text-cyan-600">
            {scenario.nasaData.precipitation}mm
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">NDVI</div>
          <div className="text-lg font-bold text-green-600">
            {scenario.nasaData.vegetationIndex.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Imagem de Satélite com Viewer Expandido */}
      {scenario.imageUrl && (
        <SatelliteMapViewer
          imageUrl={scenario.imageUrl}
          satelliteImages={scenario.satelliteImages}
          farmLocation={farmLocation}
          nasaData={scenario.nasaData}
          farmName={farmName}
        />
      )}
    </div>
  )
}

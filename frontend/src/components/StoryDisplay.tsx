'use client'

import { BookOpen, Maximize2, Satellite } from 'lucide-react'
import { useState } from 'react'
import { GameScenario } from '../../../shared/types/game-state'
import MapContainerComponent from './maps'
import ModalMapComponent from './maps/modal.map'

interface StoryDisplayProps {
  scenario: GameScenario
  farmLocation: { lat: number; lon: number }
  farmName: string
}

export default function StoryDisplay({ scenario, farmLocation, farmName }: StoryDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const soilMoistureLevel = scenario.nasaData.soilMoisture >= 60 ? 'Adequada' : scenario.nasaData.soilMoisture >= 40 ? 'Moderada' : 'Baixa'
  const soilMoistureColor = scenario.nasaData.soilMoisture >= 60 ? 'text-blue-600' : scenario.nasaData.soilMoisture >= 40 ? 'text-yellow-600' : 'text-red-600'

  const ndviLevel = scenario.nasaData.vegetationIndex >= 0.6 ? 'Alta' : scenario.nasaData.vegetationIndex >= 0.3 ? 'Média' : 'Baixa'
  const ndviColor = scenario.nasaData.vegetationIndex >= 0.6 ? 'text-green-600' : scenario.nasaData.vegetationIndex >= 0.3 ? 'text-yellow-600' : 'text-red-600'


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
      {/* {scenario.imageUrl && (
        <SatelliteMapViewer
          imageUrl={scenario.imageUrl}
          satelliteImages={scenario.satelliteImages}
          farmLocation={farmLocation}
          nasaData={scenario.nasaData}
          farmName={farmName}
        />
      )} */}
      <div className='flex flex-1 border-1 aling-content-center justify-content-center'>
        <button
          onClick={() => setIsExpanded(true)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expandir mapa"
          style={{ zIndex: 99999 }}
        >
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      {farmLocation && (
        <MapContainerComponent lat={farmLocation.lat} lon={farmLocation.lon} style={{ width: '100%', height: '400px' }} />
      )}

      <ModalMapComponent
        farmLocation={farmLocation}
        farmName={farmName}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        nasaData={scenario.nasaData}
      />

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-600">Umidade do Solo</div>
          <div className={`text-sm font-bold ${soilMoistureColor}`}>{soilMoistureLevel}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-600">Vegetação (NDVI)</div>
          <div className={`text-sm font-bold ${ndviColor}`}>{ndviLevel}</div>
        </div>
      </div>
    </div>
  )
}

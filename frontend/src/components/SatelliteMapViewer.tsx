'use client'

import { useState } from 'react'
import { X, Maximize2, MapPin, Info, Layers } from 'lucide-react'
import { NASAData, SatelliteImages } from '../../../shared/types/game-state'

interface SatelliteMapViewerProps {
  imageUrl: string // Fallback para compatibilidade
  satelliteImages?: SatelliteImages
  farmLocation: { lat: number; lon: number }
  nasaData: NASAData
  farmName: string
}

type LayerType = 'trueColor' | 'ndvi' | 'temperature'

export default function SatelliteMapViewer({
  imageUrl,
  satelliteImages,
  farmLocation,
  nasaData,
  farmName
}: SatelliteMapViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLayer, setSelectedLayer] = useState<LayerType>('ndvi')
  const [showOverlay, setShowOverlay] = useState(true)

  // Selecionar URL da imagem baseado na camada
  const getCurrentImageUrl = () => {
    if (satelliteImages) {
      return satelliteImages[selectedLayer]
    }
    return imageUrl // Fallback
  }

  const soilMoistureLevel = nasaData.soilMoisture >= 60 ? 'Adequada' : nasaData.soilMoisture >= 40 ? 'Moderada' : 'Baixa'
  const soilMoistureColor = nasaData.soilMoisture >= 60 ? 'text-blue-600' : nasaData.soilMoisture >= 40 ? 'text-yellow-600' : 'text-red-600'

  const ndviLevel = nasaData.vegetationIndex >= 0.6 ? 'Alta' : nasaData.vegetationIndex >= 0.3 ? 'Média' : 'Baixa'
  const ndviColor = nasaData.vegetationIndex >= 0.6 ? 'text-green-600' : nasaData.vegetationIndex >= 0.3 ? 'text-yellow-600' : 'text-red-600'

  // Obter cor do overlay baseado na camada selecionada
  const getOverlayGradient = () => {
    if (selectedLayer === 'ndvi') {
      const alpha = nasaData.vegetationIndex >= 0.6 ? '20' : nasaData.vegetationIndex >= 0.3 ? '15' : '10'
      const color = nasaData.vegetationIndex >= 0.6 ? '34,197,94' : nasaData.vegetationIndex >= 0.3 ? '234,179,8' : '239,68,68'
      return `radial-gradient(circle at center, rgba(${color},0.${alpha}) 0%, rgba(${color},0.05) 70%, transparent 100%)`
    } else if (selectedLayer === 'temperature') {
      const temp = nasaData.temperature
      const color = temp >= 25 ? '239,68,68' : temp >= 15 ? '234,179,8' : '59,130,246'
      return `radial-gradient(circle at center, rgba(${color},0.15) 0%, rgba(${color},0.05) 70%, transparent 100%)`
    }
    return 'none'
  }

  const layerInfo: Record<LayerType, { name: string; desc: string; icon: string }> = {
    trueColor: {
      name: 'Visão Natural',
      desc: 'Cores verdadeiras como vistas do espaço',
      icon: '🌍'
    },
    ndvi: {
      name: 'Vegetação (NDVI)',
      desc: 'Verde = vegetação saudável, Vermelho = solo exposto',
      icon: '🌱'
    },
    temperature: {
      name: 'Temperatura',
      desc: 'Vermelho = quente, Azul = frio',
      icon: '🌡️'
    }
  }

  return (
    <>
      {/* Compact View */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Imagem de Satélite NASA VIIRS
          </h3>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Expandir mapa"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Layer Selector - Compact */}
        {satelliteImages && (
          <div className="flex gap-1 mb-2">
            {(Object.keys(layerInfo) as LayerType[]).map((layer) => (
              <button
                key={layer}
                onClick={() => {
                  setSelectedLayer(layer)
                  setIsLoading(true)
                  setImageLoaded(false)
                }}
                className={`flex-1 px-2 py-1 text-xs rounded transition-all ${
                  selectedLayer === layer
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={layerInfo[layer].desc}
              >
                {layerInfo[layer].icon} {layerInfo[layer].name}
              </button>
            ))}
          </div>
        )}

        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 min-h-[192px] flex items-center justify-center">
          {imageError ? (
            <div className="text-center text-gray-400 p-8">
              <p className="text-sm mb-2">⚠️ Imagem de satélite não disponível</p>
              <p className="text-xs">Dados NASA GIBS podem ter delay de 1-8 dias</p>
              <p className="text-xs mt-2 text-gray-500">Tente outra camada</p>
            </div>
          ) : (
            <>
              {isLoading && !imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                  <div className="text-center text-gray-400">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Carregando {layerInfo[selectedLayer].name}...</p>
                    <p className="text-xs mt-1">Pode levar alguns segundos</p>
                  </div>
                </div>
              )}
              <img
                key={getCurrentImageUrl()}
                src={getCurrentImageUrl()}
                alt={`Imagem de satélite - ${layerInfo[selectedLayer].name}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.error(`Erro ao carregar ${selectedLayer}:`, getCurrentImageUrl())
                  console.error('Erro:', e)
                  setImageError(true)
                  setIsLoading(false)
                }}
                onLoad={() => {
                  console.log(`${selectedLayer} carregada com sucesso!`)
                  setImageLoaded(true)
                  setIsLoading(false)
                  setImageError(false)
                }}
              />
              {imageLoaded && showOverlay && selectedLayer !== 'trueColor' && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: getOverlayGradient() }}
                />
              )}
              {imageLoaded && (
                <>
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {farmLocation.lat.toFixed(2)}°, {farmLocation.lon.toFixed(2)}°
                  </div>
                  {/* Farm Marker */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-red-500/30 rounded-full animate-ping"></div>
                      <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg relative z-10" fill="currentColor" />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Quick Info */}
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

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {farmName}
                </h2>
                <p className="text-sm text-gray-600">
                  Coordenadas: {farmLocation.lat.toFixed(4)}°, {farmLocation.lon.toFixed(4)}°
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Satellite Image */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Layer Selector - Expanded */}
                  {satelliteImages && (
                    <div className="flex gap-2">
                      {(Object.keys(layerInfo) as LayerType[]).map((layer) => (
                        <button
                          key={layer}
                          onClick={() => {
                            setSelectedLayer(layer)
                            setIsLoading(true)
                            setImageLoaded(false)
                          }}
                          className={`flex-1 px-4 py-3 rounded-lg transition-all font-medium ${
                            selectedLayer === layer
                              ? 'bg-blue-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{layerInfo[layer].icon}</div>
                          <div className="text-sm">{layerInfo[layer].name}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Overlay Toggle */}
                  {selectedLayer !== 'trueColor' && (
                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        id="overlay-toggle"
                        checked={showOverlay}
                        onChange={(e) => setShowOverlay(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="overlay-toggle" className="text-gray-700 cursor-pointer">
                        Mostrar overlay de dados
                      </label>
                    </div>
                  )}

                  <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 min-h-[500px]">
                    {imageError ? (
                      <div className="text-center text-gray-400 p-16">
                        <p className="text-lg mb-2">⚠️ Imagem de satélite não disponível</p>
                        <p className="text-sm">Camada: {layerInfo[selectedLayer].name}</p>
                        <p className="text-xs mt-2 text-gray-500">URL: {getCurrentImageUrl().substring(0, 100)}...</p>
                        <button
                          onClick={() => {
                            setImageError(false)
                            setIsLoading(true)
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Tentar Novamente
                        </button>
                      </div>
                    ) : (
                      <>
                        {isLoading && !imageLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                            <div className="text-center text-gray-400">
                              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                              <p className="text-lg">Carregando {layerInfo[selectedLayer].name}...</p>
                              <p className="text-sm mt-2">Aguarde, isso pode levar alguns segundos</p>
                            </div>
                          </div>
                        )}
                        <img
                          key={getCurrentImageUrl()}
                          src={getCurrentImageUrl()}
                          alt={`Imagem de satélite - ${layerInfo[selectedLayer].name}`}
                          className="w-full h-[500px] object-cover"
                          onError={(e) => {
                            console.error(`Erro ao carregar ${selectedLayer} expandida:`, getCurrentImageUrl())
                            setImageError(true)
                            setIsLoading(false)
                          }}
                          onLoad={() => {
                            console.log(`${selectedLayer} expandida carregada!`)
                            setImageLoaded(true)
                            setIsLoading(false)
                            setImageError(false)
                          }}
                        />
                        {/* Overlay */}
                        {imageLoaded && showOverlay && selectedLayer !== 'trueColor' && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: getOverlayGradient() }}
                          />
                        )}
                        {/* Location Pin Overlay */}
                        {imageLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative">
                              <div className="absolute -inset-8 bg-red-500/20 rounded-full animate-ping"></div>
                              <MapPin className="w-16 h-16 text-red-500 drop-shadow-2xl relative z-10" fill="currentColor" />
                              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                {farmName}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Coordinate Overlay */}
                        {imageLoaded && (
                          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded">
                            <div className="text-xs text-gray-300">Localização</div>
                            <div className="text-sm font-mono">{farmLocation.lat.toFixed(4)}°N</div>
                            <div className="text-sm font-mono">{farmLocation.lon.toFixed(4)}°E</div>
                          </div>
                        )}

                        {/* Scale Indicator */}
                        {imageLoaded && (
                          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-white"></div>
                              <span>≈ 400km</span>
                            </div>
                          </div>
                        )}

                        {/* Layer Info */}
                        {imageLoaded && (
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded text-xs max-w-xs">
                            <div className="flex items-start gap-2">
                              <Layers className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>I
                                <div className="font-semibold">{layerInfo[selectedLayer].name}</div>
                                <div className="text-gray-300 mt-1">{layerInfo[selectedLayer].desc}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Sobre a Camada {layerInfo[selectedLayer].name}</p>
                        <p>
                          {selectedLayer === 'trueColor' && 'Imagem de satélite em cores verdadeiras obtida via NASA GIBS usando o sensor VIIRS. Mostra a Terra como seria vista do espaço.'}
                          {selectedLayer === 'ndvi' && 'Índice de Vegetação por Diferença Normalizada (NDVI) do MODIS Terra. Verde intenso indica vegetação saudável e densa, enquanto vermelho indica solo exposto ou vegetação esparsa.'}
                          {selectedLayer === 'temperature' && 'Temperatura da superfície terrestre medida pelo MODIS Terra. Cores quentes (vermelho/laranja) indicam áreas mais quentes, enquanto cores frias (azul) indicam áreas mais frias.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Panel */}
                <div className="space-y-4">
                  {/* Soil Moisture */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Umidade do Solo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-blue-700">Nível atual</span>
                        <span className={`text-2xl font-bold ${soilMoistureColor}`}>
                          {nasaData.soilMoisture.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${nasaData.soilMoisture >= 60 ? 'bg-blue-600' : nasaData.soilMoisture >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${nasaData.soilMoisture}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        {nasaData.soilMoisture >= 60 && 'Solo com boa disponibilidade de água para as plantas.'}
                        {nasaData.soilMoisture >= 40 && nasaData.soilMoisture < 60 && 'Solo com umidade moderada, pode requerer irrigação.'}
                        {nasaData.soilMoisture < 40 && 'Solo seco, irrigação recomendada.'}
                      </p>
                    </div>
                  </div>

                  {/* NDVI */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-3">Índice de Vegetação (NDVI)</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-green-700">Índice</span>
                        <span className={`text-2xl font-bold ${ndviColor}`}>
                          {nasaData.vegetationIndex.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${nasaData.vegetationIndex >= 0.6 ? 'bg-green-600' : nasaData.vegetationIndex >= 0.3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${nasaData.vegetationIndex * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-green-700 mt-2">
                        {nasaData.vegetationIndex >= 0.6 && 'Vegetação densa e saudável.'}
                        {nasaData.vegetationIndex >= 0.3 && nasaData.vegetationIndex < 0.6 && 'Vegetação moderada, pode indicar estresse hídrico.'}
                        {nasaData.vegetationIndex < 0.3 && 'Vegetação esparsa ou solo exposto.'}
                      </p>
                    </div>
                  </div>

                  {/* Climate Data */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <h3 className="font-bold text-orange-900 mb-3">Dados Climáticos</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-orange-700">Temperatura</div>
                        <div className="text-xl font-bold text-orange-600">{nasaData.temperature}°C</div>
                      </div>
                      <div>
                        <div className="text-sm text-orange-700">Precipitação</div>
                        <div className="text-xl font-bold text-cyan-600">{nasaData.precipitation}mm</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3">Legenda do Mapa</h3>
                    <div className="space-y-2 text-xs">
                      {selectedLayer === 'ndvi' && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-600 rounded"></div>
                            <span className='text-gray-700'>Vegetação densa (NDVI &gt; 0.6)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                            <span className='text-gray-700'>Vegetação moderada (NDVI 0.3-0.6)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                            <span className='text-gray-700'>Solo exposto (NDVI &lt; 0.3)</span>
                          </div>
                        </>
                      )}
                      {selectedLayer === 'temperature' && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                            <span className='text-gray-700'>Quente (&gt; 25°C)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                            <span className='text-gray-700'>Moderado (15-25°C)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded"></div>
                            <span className='text-gray-700'>Frio (&lt; 15°C)</span>
                          </div>
                        </>
                      )}
                      {selectedLayer === 'trueColor' && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-600 rounded"></div>
                            <span className='text-gray-700'>Vegetação</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-800 rounded"></div>
                            <span className='text-gray-700'>Solo/Deserto</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded"></div>
                            <span className='text-gray-700'>Água</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                            <span className='text-gray-700'>Nuvens/Gelo</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-300 mt-2">
                        <MapPin className="w-4 h-4 text-red-500" fill="currentColor" />
                        <span className="font-semibold text-gray-700">Sua fazenda</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

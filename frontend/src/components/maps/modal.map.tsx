import { Info, MapPin, X } from 'lucide-react'
import MapContainerComponent from "."

type LayerType = 'trueColor' | 'ndvi' | 'temperature'

const ModalMapComponent = ({ isExpanded, setIsExpanded, nasaData, farmLocation, farmName }: { isExpanded: boolean, setIsExpanded: Function, nasaData: any, farmLocation: { lat: number, lon: number }, farmName: string }) => {

    // const soilMoistureLevel = nasaData.soilMoisture >= 60 ? 'Adequada' : nasaData.soilMoisture >= 40 ? 'Moderada' : 'Baixa'
    const soilMoistureColor = nasaData.soilMoisture >= 60 ? 'text-blue-600' : nasaData.soilMoisture >= 40 ? 'text-yellow-600' : 'text-red-600'

    // const ndviLevel = nasaData.vegetationIndex >= 0.6 ? 'Alta' : nasaData.vegetationIndex >= 0.3 ? 'Média' : 'Baixa'
    const ndviColor = nasaData.vegetationIndex >= 0.6 ? 'text-green-600' : nasaData.vegetationIndex >= 0.3 ? 'text-yellow-600' : 'text-red-600'

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

    if (!isExpanded) return <></>

    return (

        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" style={{ zIndex: 999999999 }}>
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
                            {/* <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 min-h-[500px]"> */}
                            <MapContainerComponent lat={farmLocation.lat} lon={farmLocation.lon} style={{ width: '100%', height: '50vh' }} />
                            {/* </div> */}

                            {/* Image Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Sobre a Camada {layerInfo['trueColor'].name}</p>
                                        <p>
                                            {'Imagem de satélite em cores verdadeiras obtida via NASA GIBS usando o sensor VIIRS. Mostra a Terra como seria vista do espaço.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Sobre a Camada {layerInfo['ndvi'].name}</p>
                                        <p>
                                            {'Índice de Vegetação por Diferença Normalizada (NDVI) do MODIS Terra. Verde intenso indica vegetação saudável e densa, enquanto vermelho indica solo exposto ou vegetação esparsa.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Sobre a Camada {layerInfo['temperature'].name}</p>
                                        <p>
                                            {'Temperatura da superfície terrestre medida pelo MODIS Terra. Cores quentes (vermelho/laranja) indicam áreas mais quentes, enquanto cores frias (azul) indicam áreas mais frias.'}
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
                                    <div className="border-t border-gray-300 mt-2 gap-3">
                                        <strong className='text-gray-700'>Vegetação/NDVI (NASA)</strong>

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
                                    </div>
                                    <div className="border-t border-gray-300 mt-2 gap-3">
                                        <strong className='text-gray-700'> Temperatura (NASA)</strong>

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
                                    </div>
                                    {/* <div className="border-t border-gray-300 mt-2 gap-3">

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
                                    </div> */}
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
    )
}


export default ModalMapComponent;
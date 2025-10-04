'use client'

import { GameMetrics } from '../../../shared/types/game-state'
import { TrendingUp, Leaf } from 'lucide-react'

interface MetricsDashboardProps {
  metrics: GameMetrics
  turn: number
  maxTurns: number
}

export default function MetricsDashboard({ metrics, turn, maxTurns }: MetricsDashboardProps) {
  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 50) return 'text-yellow-600'
    if (value >= 20) return 'text-orange-600'
    return 'text-red-600'
  }

  const getBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 50) return 'bg-yellow-500'
    if (value >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Métricas</h2>
        <div className="text-sm text-gray-600">
          Turno <span className="font-semibold">{turn}</span> / {maxTurns}
        </div>
      </div>

      {/* Produção */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Produção</span>
          </div>
          <span className={`text-2xl font-bold ${getMetricColor(metrics.production)}`}>
            {metrics.production}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getBarColor(metrics.production)}`}
            style={{ width: `${metrics.production}%` }}
          />
        </div>
      </div>

      {/* Sustentabilidade */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700">Sustentabilidade</span>
          </div>
          <span className={`text-2xl font-bold ${getMetricColor(metrics.sustainability)}`}>
            {metrics.sustainability}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getBarColor(metrics.sustainability)}`}
            style={{ width: `${metrics.sustainability}%` }}
          />
        </div>
      </div>

      {/* Alertas */}
      {(metrics.production < 30 || metrics.sustainability < 30) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ Atenção! {metrics.production < 30 && 'Produção baixa. '}
            {metrics.sustainability < 30 && 'Sustentabilidade baixa. '}
            Abaixo de 20 é Game Over!
          </p>
        </div>
      )}
    </div>
  )
}

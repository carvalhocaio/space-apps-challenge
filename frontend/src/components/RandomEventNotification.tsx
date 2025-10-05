'use client'

import { RandomEvent } from '../../../shared/types/game-state'
import { AlertTriangle, Cloud, Bug, TrendingDown, Leaf, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RandomEventNotificationProps {
  event: RandomEvent
  onClose: () => void
}

export default function RandomEventNotification({ event, onClose }: RandomEventNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const getEventIcon = () => {
    switch (event.type) {
      case 'climate':
        return <Cloud className="w-12 h-12 text-blue-500" />
      case 'plague':
        return <Bug className="w-12 h-12 text-red-500" />
      case 'market':
        return <TrendingDown className="w-12 h-12 text-orange-500" />
      case 'natural':
        return <Leaf className="w-12 h-12 text-green-500" />
      default:
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />
    }
  }

  const getEventColor = () => {
    switch (event.type) {
      case 'climate':
        return 'border-blue-500 bg-blue-50'
      case 'plague':
        return 'border-red-500 bg-red-50'
      case 'market':
        return 'border-orange-500 bg-orange-50'
      case 'natural':
        return 'border-green-500 bg-green-50'
      default:
        return 'border-yellow-500 bg-yellow-50'
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className={`
          max-w-md w-full rounded-lg shadow-2xl border-4 p-6
          transition-all duration-300 transform
          ${getEventColor()}
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header com ícone */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getEventIcon()}
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                Evento Aleatório - Turno {event.turn}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Descrição do evento */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>

        {/* Impactos */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Impactos nas Métricas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-xs text-gray-500">Produção</div>
                <div
                  className={`text-lg font-bold ${
                    event.impacts.production < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {event.impacts.production > 0 ? '+' : ''}
                  {event.impacts.production}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-xs text-gray-500">Sustentabilidade</div>
                <div
                  className={`text-lg font-bold ${
                    event.impacts.sustainability < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {event.impacts.sustainability > 0 ? '+' : ''}
                  {event.impacts.sustainability}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de continuar */}
        <button
          onClick={handleClose}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Continuar
        </button>

        {/* Dica educativa */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          💡 Eventos aleatórios simulam a imprevisibilidade da agricultura real
        </div>
      </div>
    </div>
  )
}

'use client'

import { GameOption } from '../../../shared/types/game-state'
import { TrendingUp, Leaf, Info, Droplet, Beaker, Sprout, DollarSign } from 'lucide-react'
import { useState } from 'react'

interface ChoiceButtonsProps {
  options: GameOption[]
  onChoice: (optionId: string) => void
  disabled?: boolean
}

export default function ChoiceButtons({ options, onChoice, disabled = false }: ChoiceButtonsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleChoice = (optionId: string) => {
    if (disabled) return
    setSelectedId(optionId)
    setTimeout(() => {
      onChoice(optionId)
      setSelectedId(null)
    }, 300)
  }

  const getImpactColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getImpactText = (value: number) => {
    if (value > 0) return `+${value}`
    return value.toString()
  }

  const getResourceIcon = (resourceKey: string) => {
    const icons = {
      water: <Droplet className="w-3 h-3 text-blue-600" />,
      fertilizer: <Beaker className="w-3 h-3 text-purple-600" />,
      seeds: <Sprout className="w-3 h-3 text-green-600" />,
      money: <DollarSign className="w-3 h-3 text-yellow-600" />,
    }
    return icons[resourceKey as keyof typeof icons] || null
  }

  const getResourceLabel = (resourceKey: string) => {
    const labels: Record<string, string> = {
      water: 'Água',
      fertilizer: 'Fertilizante',
      seeds: 'Sementes',
      money: 'Dinheiro',
    }
    return labels[resourceKey] || resourceKey
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Suas Opções</h3>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleChoice(option.id)}
            disabled={disabled}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedId === option.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{option.description}</h4>
                </div>

                {/* Impactos */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className={`text-sm font-medium ${getImpactColor(option.impacts.production)}`}>
                      {getImpactText(option.impacts.production)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className={`text-sm font-medium ${getImpactColor(option.impacts.sustainability)}`}>
                      {getImpactText(option.impacts.sustainability)}
                    </span>
                  </div>
                </div>

                {/* Custos */}
                {option.resourceCost && Object.values(option.resourceCost).some(v => v > 0) && (
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-gray-600 font-medium">Custo:</span>
                    {Object.entries(option.resourceCost)
                      .filter(([_, v]) => v > 0)
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                          {getResourceIcon(key)}
                          <span className="text-xs font-medium text-gray-700">
                            {getResourceLabel(key)}: {value}
                          </span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Tooltip Educativo */}
                <details
                  className="group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 list-none">
                    <Info className="w-4 h-4" />
                    <span>Por que essa decisão?</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    {option.educational}
                  </p>
                </details>
              </div>
            </div>
          </button>
        ))}
      </div>

      {disabled && (
        <p className="text-center text-gray-500 text-sm animate-pulse">
          Processando sua escolha...
        </p>
      )}
    </div>
  )
}

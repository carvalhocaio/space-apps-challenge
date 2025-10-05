'use client'

import { GameOption, Resources } from '../../../shared/types/game-state'
import { TrendingUp, Leaf, Info, Droplet, Beaker, Sprout, DollarSign, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface ChoiceButtonsProps {
  options: GameOption[]
  onChoice: (optionId: string) => void
  disabled?: boolean
  currentResources?: Resources
}

export default function ChoiceButtons({ options, onChoice, disabled = false, currentResources }: ChoiceButtonsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const canAfford = (option: GameOption): boolean => {
    if (!currentResources || !option.resourceCost) return true

    const cost = option.resourceCost
    if (cost.water && currentResources.water < cost.water) return false
    if (cost.fertilizer && currentResources.fertilizer < cost.fertilizer) return false
    if (cost.seeds && currentResources.seeds < cost.seeds) return false
    if (cost.money && currentResources.money < cost.money) return false

    return true
  }

  const getMissingResources = (option: GameOption): string[] => {
    if (!currentResources || !option.resourceCost) return []

    const missing: string[] = []
    const cost = option.resourceCost

    if (cost.water && currentResources.water < cost.water) {
      missing.push(`Água (faltam ${cost.water - currentResources.water})`)
    }
    if (cost.fertilizer && currentResources.fertilizer < cost.fertilizer) {
      missing.push(`Fertilizante (faltam ${cost.fertilizer - currentResources.fertilizer})`)
    }
    if (cost.seeds && currentResources.seeds < cost.seeds) {
      missing.push(`Sementes (faltam ${cost.seeds - currentResources.seeds})`)
    }
    if (cost.money && currentResources.money < cost.money) {
      missing.push(`Dinheiro (faltam R$ ${cost.money - currentResources.money})`)
    }

    return missing
  }

  const handleChoice = (optionId: string, option: GameOption) => {
    if (disabled || !canAfford(option)) return
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
        {options.map((option) => {
          const affordable = canAfford(option)
          const missingResources = getMissingResources(option)
          const isDisabled = disabled || !affordable

          return (
          <button
            key={option.id}
            onClick={() => handleChoice(option.id, option)}
            disabled={isDisabled}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedId === option.id
                ? 'border-green-500 bg-green-50'
                : affordable
                  ? 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                  : 'border-red-300 bg-red-50'
            } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
                      .map(([key, value]) => {
                        const hasEnough = !currentResources ||
                          (currentResources as any)[key] >= (value || 0)

                        return (
                        <div
                          key={key}
                          className={`flex items-center gap-1 px-2 py-1 rounded ${
                            hasEnough ? 'bg-gray-100' : 'bg-red-100'
                          }`}
                        >
                          {getResourceIcon(key)}
                          <span className={`text-xs font-medium ${
                            hasEnough ? 'text-gray-700' : 'text-red-700'
                          }`}>
                            {getResourceLabel(key)}: {value}
                          </span>
                        </div>
                        )
                      })}
                  </div>
                )}

                {/* Badge de recursos insuficientes */}
                {!affordable && missingResources.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-100 border border-red-300 rounded mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <div className="text-xs text-red-700">
                      <span className="font-semibold">Recursos Insuficientes:</span>
                      <div className="mt-1">{missingResources.join(', ')}</div>
                    </div>
                  </div>
                )}

                {/* Tooltip Educativo */}
                <details
                  className="group"
                  onClick={(e) => e.stopPropagation()}
                  open
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
          )
        })}
      </div>

      {disabled && (
        <p className="text-center text-gray-500 text-sm animate-pulse">
          Processando sua escolha...
        </p>
      )}
    </div>
  )
}

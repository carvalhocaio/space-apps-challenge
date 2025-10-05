'use client'

import { useState } from 'react'
import { Resources } from '../../../shared/types/game-state'
import { Droplet, Beaker, Sprout, ShoppingCart, X, Plus, Minus } from 'lucide-react'

interface ResourceShopProps {
  currentResources: Resources
  onPurchase: (resourceType: 'water' | 'fertilizer' | 'seeds', quantity: number) => Promise<void>
  onClose: () => void
}

const RESOURCE_PRICES = {
  water: 10,
  fertilizer: 15,
  seeds: 20,
}

const MAX_RESOURCE = 100

export default function ResourceShop({ currentResources, onPurchase, onClose }: ResourceShopProps) {
  const [quantities, setQuantities] = useState({
    water: 0,
    fertilizer: 0,
    seeds: 0,
  })
  const [purchasing, setPurchasing] = useState(false)

  const resourceConfig = [
    {
      key: 'water' as const,
      label: 'Água',
      icon: Droplet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      key: 'fertilizer' as const,
      label: 'Fertilizante',
      icon: Beaker,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      key: 'seeds' as const,
      label: 'Sementes',
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ]

  const updateQuantity = (resourceKey: keyof typeof quantities, delta: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(0, prev[resourceKey] + delta)
      const currentAmount = currentResources[resourceKey]
      const maxCanBuy = MAX_RESOURCE - currentAmount

      return {
        ...prev,
        [resourceKey]: Math.min(newQuantity, maxCanBuy),
      }
    })
  }

  const setQuickQuantity = (resourceKey: keyof typeof quantities, amount: number) => {
    const currentAmount = currentResources[resourceKey]
    const maxCanBuy = MAX_RESOURCE - currentAmount
    setQuantities((prev) => ({
      ...prev,
      [resourceKey]: Math.min(amount, maxCanBuy),
    }))
  }

  const getTotalCost = () => {
    return (
      quantities.water * RESOURCE_PRICES.water +
      quantities.fertilizer * RESOURCE_PRICES.fertilizer +
      quantities.seeds * RESOURCE_PRICES.seeds
    )
  }

  const canAfford = () => {
    return getTotalCost() <= currentResources.money
  }

  const handlePurchase = async (resourceKey: 'water' | 'fertilizer' | 'seeds') => {
    const quantity = quantities[resourceKey]
    if (quantity <= 0) return

    setPurchasing(true)
    try {
      await onPurchase(resourceKey, quantity)
      setQuantities((prev) => ({ ...prev, [resourceKey]: 0 }))
    } catch (error) {
      console.error('Erro ao comprar:', error)
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Loja da Fazenda</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-yellow-600 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dinheiro disponível */}
        <div className="p-6 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">Dinheiro Disponível:</span>
            <span className="text-2xl font-bold text-yellow-600">R$ {currentResources.money}</span>
          </div>
        </div>

        {/* Recursos */}
        <div className="p-6 space-y-4">
          {resourceConfig.map(({ key, label, icon: Icon, color, bgColor, borderColor }) => {
            const price = RESOURCE_PRICES[key]
            const current = currentResources[key]
            const quantity = quantities[key]
            const cost = quantity * price
            const maxCanBuy = MAX_RESOURCE - current
            const isMaxed = current >= MAX_RESOURCE

            return (
              <div key={key} className={`border-2 ${borderColor} rounded-lg p-4 ${bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${color}`} />
                    <div>
                      <h3 className="font-bold text-gray-900">{label}</h3>
                      <p className="text-sm text-gray-600">
                        Estoque: {current} / {MAX_RESOURCE} • Preço: R$ {price}/unidade
                      </p>
                    </div>
                  </div>
                </div>

                {isMaxed ? (
                  <div className="text-center py-2 text-sm text-gray-500 font-medium">
                    ✓ Estoque máximo atingido
                  </div>
                ) : (
                  <>
                    {/* Botões rápidos */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setQuickQuantity(key, 1)}
                        className="flex-1 py-1 px-2 text-sm text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => setQuickQuantity(key, 5)}
                        className="flex-1 py-1 px-2 text-sm text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium disabled:opacity-50"
                        disabled={maxCanBuy < 5}
                      >
                        +5
                      </button>
                      <button
                        onClick={() => setQuickQuantity(key, 10)}
                        className="flex-1 py-1 px-2 text-sm text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium disabled:opacity-50"
                        disabled={maxCanBuy < 10}
                      >
                        +10
                      </button>
                      <button
                        onClick={() => setQuickQuantity(key, maxCanBuy)}
                        className="flex-1 py-1 px-2 text-sm text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium"
                      >
                        Máx
                      </button>
                    </div>

                    {/* Controle de quantidade */}
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => updateQuantity(key, -1)}
                        disabled={quantity === 0}
                        className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4 text-gray-900" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setQuickQuantity(key, val)
                        }}
                        className="flex-1 text-center py-2 border border-gray-300 rounded font-bold text-lg text-gray-900"
                        min="0"
                        max={maxCanBuy}
                      />
                      <button
                        onClick={() => updateQuantity(key, 1)}
                        disabled={quantity >= maxCanBuy}
                        className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 text-gray-900" />
                      </button>
                    </div>

                    {/* Info e botão de compra */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {quantity > 0 ? (
                          <span className="font-semibold text-gray-700">
                            Custo: <span className={cost > currentResources.money ? 'text-red-600' : color}>
                              R$ {cost}
                            </span>
                          </span>
                        ) : (
                          <span className="text-gray-500">Selecione quantidade</span>
                        )}
                      </div>
                      <button
                        onClick={() => handlePurchase(key)}
                        disabled={purchasing || quantity === 0 || cost > currentResources.money}
                        className={`px-4 py-2 rounded font-semibold text-white transition-colors ${
                          quantity > 0 && cost <= currentResources.money
                            ? key === 'water' ? 'bg-blue-600 hover:bg-blue-700' :
                              key === 'fertilizer' ? 'bg-purple-600 hover:bg-purple-700' :
                              'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {purchasing ? 'Comprando...' : 'Comprar'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-gray-700">Total do Carrinho:</span>
            <span className={`text-2xl font-bold ${canAfford() ? 'text-green-600' : 'text-red-600'}`}>
              R$ {getTotalCost()}
            </span>
          </div>
          {!canAfford() && getTotalCost() > 0 && (
            <p className="text-sm text-red-600 text-center">
              Dinheiro insuficiente. Faltam R$ {getTotalCost() - currentResources.money}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

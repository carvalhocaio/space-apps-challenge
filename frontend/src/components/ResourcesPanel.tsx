'use client'

import { Resources } from '../../../shared/types/game-state'
import { Droplet, Beaker, Sprout, DollarSign } from 'lucide-react'

interface ResourcesPanelProps {
  resources: Resources
}

export default function ResourcesPanel({ resources }: ResourcesPanelProps) {
  const resourceItems = [
    { icon: Droplet, label: 'Água', value: resources.water, color: 'text-blue-600', max: 100 },
    { icon: Beaker, label: 'Fertilizante', value: resources.fertilizer, color: 'text-purple-600', max: 100 },
    { icon: Sprout, label: 'Sementes', value: resources.seeds, color: 'text-green-600', max: 100 },
    { icon: DollarSign, label: 'Dinheiro', value: resources.money, color: 'text-yellow-600', max: null },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recursos</h3>
      <div className="space-y-3">
        {resourceItems.map(({ icon: Icon, label, value, color, max }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${color}`}>
                {label === 'Dinheiro' ? `R$ ${value}` : value}
              </span>
              {max && (
                <span className="text-xs text-gray-500">/ {max}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

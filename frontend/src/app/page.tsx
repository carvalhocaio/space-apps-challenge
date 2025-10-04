'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sprout, Satellite, Brain, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <Sprout className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-green-900 mb-4">
            NASA Farm Navigator
          </h1>

          <p className="text-xl text-green-700 max-w-2xl mx-auto mb-8">
            Um RPG de texto que utiliza dados reais da NASA para ensinar práticas agrícolas sustentáveis através de decisões estratégicas
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/game"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Começar Jogo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Satellite className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dados NASA Reais
            </h3>
            <p className="text-gray-600">
              Cenários gerados com dados de satélite, umidade do solo e clima da NASA
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              IA como Mestre
            </h3>
            <p className="text-gray-600">
              Narrativa procedural única gerada por inteligência artificial
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Decisões Estratégicas
            </h3>
            <p className="text-gray-600">
              Balance produção e sustentabilidade em cada escolha
            </p>
          </div>
        </div>

        {/* How to Play */}
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Jogar</h2>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold">1.</span> Escolha a localização da sua fazenda no mapa</p>
            <p><span className="font-semibold">2.</span> A IA gerará cenários baseados em dados NASA reais da região</p>
            <p><span className="font-semibold">3.</span> Tome decisões que impactam Produção e Sustentabilidade</p>
            <p><span className="font-semibold">4.</span> Mantenha ambas métricas acima de 20 para continuar</p>
            <p><span className="font-semibold">5.</span> Alcance 80+ em ambas para vencer em 20 turnos</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600">
          <p className="mb-2">Desenvolvido para o NASA Space Apps Challenge 2025</p>
          <p className="text-sm">Utilizando dados de GLAM, Crop-CASMA e NASA Worldview</p>
        </div>
      </div>
    </main>
  )
}

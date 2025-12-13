'use client'

import { useState, useEffect } from 'react'

interface Plan {
  id: string
  name: string
  price: number
  duration: string
  features: string[]
  isPopular?: boolean
}

export default function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans')
        const data = await response.json()
        if (data.success) {
          // Parse features from string to array if needed
          const parsedPlans = data.data.map((plan: any) => ({
            ...plan,
            features: typeof plan.features === 'string'
              ? plan.features.split(',').map((f: string) => f.trim()).filter(Boolean)
              : Array.isArray(plan.features)
              ? plan.features
              : []
          }))
          setPlans(parsedPlans)
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    console.log('Selected plan:', planId)
  }

  const isPopular = (plan: Plan) => {
    return plan.isPopular || plan.name.toLowerCase().includes('premium')
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ładowanie planów cenowych...
            </h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30 mb-6">
            <span className="text-orange-300 text-sm font-semibold">💰 Przejrzyste Ceny</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Cennik
            </span>
            <br />
            <span className="text-3xl text-gray-400 font-normal">dla każdego budżetu</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Wybierz plan idealny dla Twoich potrzeb i ciesz się elastycznością wynajmu. 
            <span className="text-orange-300 font-semibold">Bez ukrytych opłat</span> - płacisz tylko za to, czego używasz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="group relative cursor-pointer" onClick={() => setSelectedPlan(plan.id)}>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
              
              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-3xl shadow-2xl p-8 transition-all duration-500 hover:scale-105 border-2 border-gray-600/50 hover:border-orange-400/50 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {plan.price}zł
                    </span>
                    <span className="text-gray-400 text-lg ml-2">/{plan.duration}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan.id)}
                  className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500/50 border-2 border-gray-600 hover:border-gray-500"
                >
                  Wybierz plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

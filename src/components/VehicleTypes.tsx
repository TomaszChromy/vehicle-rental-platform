'use client'

import { useState, useEffect } from 'react'

interface Vehicle {
  id: string
  brand: string
  model: string
  type: 'car' | 'bike' | 'scooter'
  pricePerHour: number
  pricePerDay: number
  isAvailable: boolean
  location: string
  imageUrl: string
}

export default function VehicleTypes() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const vehicleTypes = [
    {
      type: 'car',
      name: 'Samochody',
      description: 'Nowoczesne samochody osobowe',
      features: ['Klimatyzacja', 'GPS', 'Bluetooth', 'Ubezpieczenie']
    },
    {
      type: 'bike',
      name: 'Rowery',
      description: 'Ekologiczne rowery elektryczne',
      features: ['Napęd elektryczny', 'Zasięg 50km', 'Koszyk', 'LED']
    },
    {
      type: 'scooter',
      name: 'Hulajnogi',
      description: 'Szybkie hulajnogi elektryczne',
      features: ['Składana konstrukcja', 'Zasięg 25km', 'Aplikacja', 'Ładowanie']
    }
  ]

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles')
        const data = await response.json()
        if (data.success) {
          setVehicles(data.data)
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const handleVehicleSelect = (vehicleType: string) => {
    setSelectedVehicle(vehicleType)
    console.log('Selected vehicle type:', vehicleType)
  }

  const getVehiclesByType = (type: string) => {
    return vehicles.filter(vehicle => vehicle.type === type)
  }

  const getMinPrice = (type: string) => {
    const vehiclesOfType = getVehiclesByType(type)
    if (vehiclesOfType.length === 0) return 0
    return Math.min(...vehiclesOfType.map(v => v.pricePerHour))
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ładowanie pojazdów...
            </h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30 mb-6">
            <span className="text-orange-600 text-sm font-semibold">🚗 Nasza Flota</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Wybierz
            </span>
            <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent">
              swój pojazd
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Wybierz pojazd idealny dla Twoich potrzeb z naszej nowoczesnej floty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicleTypes.map((vehicleType) => {
            const minPrice = getMinPrice(vehicleType.type)
            const availableCount = getVehiclesByType(vehicleType.type).filter(v => v.isAvailable).length

            return (
              <div
                key={vehicleType.type}
                className="group relative cursor-pointer"
                onClick={() => handleVehicleSelect(vehicleType.type)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>

                <div className="relative bg-white rounded-3xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:scale-105 border-2 border-gray-100 hover:border-orange-200">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicleType.name}</h3>
                    <p className="text-gray-600">{vehicleType.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        od {minPrice}zł
                      </span>
                      <span className="text-gray-500 text-sm ml-2">/godz</span>
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {availableCount} dostępnych
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {vehicleType.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleVehicleSelect(vehicleType.type)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-400 hover:to-red-400 focus:outline-none focus:ring-4 focus:ring-orange-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Wybierz teraz
                    </button>
                    <button
                      type="button"
                      className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200/50 transition-all duration-300"
                    >
                      Zobacz na mapie
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

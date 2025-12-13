'use client'

import { useState, useEffect } from 'react'
import VehicleMap from '@/components/VehicleMap'
import { 
  MapPinIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Vehicle {
  id: string
  type: string
  brand: string
  model: string
  year: number
  licensePlate: string
  color: string
  description: string
  pricePerDay: number
  isAvailable: boolean
  location: string
  features: string[]
  images: string[]
  coordinates?: {
    lat: number
    lng: number
  }
}

export default function MapPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterAvailability, setFilterAvailability] = useState('ALL')
  const [filterLocation, setFilterLocation] = useState('ALL')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    filterVehicles()
  }, [vehicles, searchTerm, filterType, filterAvailability, filterLocation])

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

  const filterVehicles = () => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === 'ALL' || vehicle.type === filterType
      const matchesAvailability = 
        filterAvailability === 'ALL' ||
        (filterAvailability === 'AVAILABLE' && vehicle.isAvailable) ||
        (filterAvailability === 'UNAVAILABLE' && !vehicle.isAvailable)
      const matchesLocation = filterLocation === 'ALL' || vehicle.location === filterLocation

      return matchesSearch && matchesType && matchesAvailability && matchesLocation
    })

    setFilteredVehicles(filtered)
  }

  const getVehicleTypeText = (type: string) => {
    switch (type) {
      case 'CAR': return 'Samochód'
      case 'BIKE': return 'Rower'
      case 'SCOOTER': return 'Hulajnoga'
      default: return type
    }
  }

  const getUniqueLocations = () => {
    const locations = vehicles.map(v => v.location)
    return [...new Set(locations)].sort()
  }

  const getVehicleStats = () => {
    const total = filteredVehicles.length
    const available = filteredVehicles.filter(v => v.isAvailable).length
    const cars = filteredVehicles.filter(v => v.type === 'CAR').length
    const bikes = filteredVehicles.filter(v => v.type === 'BIKE').length
    const scooters = filteredVehicles.filter(v => v.type === 'SCOOTER').length

    return { total, available, cars, bikes, scooters }
  }

  const stats = getVehicleStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie mapy pojazdów...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MapPinIcon className="h-8 w-8 mr-3 text-orange-600" />
                Mapa pojazdów
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Znajdź pojazdy w swojej okolicy
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                ← Strona główna
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtry
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statystyki */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Łącznie</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-500">Dostępne</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.cars}</div>
            <div className="text-sm text-gray-500">Samochody</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.bikes}</div>
            <div className="text-sm text-gray-500">Rowery</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-indigo-600">{stats.scooters}</div>
            <div className="text-sm text-gray-500">Hulajnogi</div>
          </div>
        </div>

        {/* Filtry */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtry wyszukiwania</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj pojazdów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Wszystkie typy</option>
                <option value="CAR">Samochody</option>
                <option value="BIKE">Rowery</option>
                <option value="SCOOTER">Hulajnogi</option>
              </select>

              {/* Availability Filter */}
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Wszystkie statusy</option>
                <option value="AVAILABLE">Dostępne</option>
                <option value="UNAVAILABLE">Niedostępne</option>
              </select>

              {/* Location Filter */}
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Wszystkie lokalizacje</option>
                {getUniqueLocations().map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Lokalizacje pojazdów ({filteredVehicles.length})
            </h3>
            <div className="text-sm text-gray-500">
              Kliknij marker, aby zobaczyć szczegóły pojazdu
            </div>
          </div>
          <VehicleMap 
            vehicles={filteredVehicles}
            height="500px"
            showVehicles={true}
          />
        </div>

        {/* Lista pojazdów */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista pojazdów ({filteredVehicles.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Brak pojazdów</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Nie znaleziono pojazdów spełniających kryteria wyszukiwania.
                </p>
              </div>
            ) : (
              filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-20">
                        <img
                          className="h-16 w-20 rounded-md object-cover"
                          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-medium text-gray-900">
                          {vehicle.brand} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getVehicleTypeText(vehicle.type)} • {vehicle.year} • {vehicle.color}
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{vehicle.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-orange-600">
                          {vehicle.pricePerDay} PLN
                        </div>
                        <div className="text-sm text-gray-500">za dzień</div>
                      </div>
                      <div className="flex items-center">
                        {vehicle.isAvailable ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Dostępny
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Niedostępny
                          </span>
                        )}
                      </div>
                      {vehicle.isAvailable && (
                        <button
                          onClick={() => window.location.href = `/booking?vehicleId=${vehicle.id}`}
                          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-sm font-medium"
                        >
                          Zarezerwuj
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

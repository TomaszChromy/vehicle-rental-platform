'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  TruckIcon
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
  createdAt: string
  updatedAt: string
}

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterAvailability, setFilterAvailability] = useState('ALL')

  useEffect(() => {
    fetchVehicles()
  }, [])

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

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten pojazd?')) return

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setVehicles(vehicles.filter(v => v.id !== vehicleId))
        alert('Pojazd został usunięty')
      } else {
        alert('Błąd podczas usuwania pojazdu')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Błąd podczas usuwania pojazdu')
    }
  }

  const handleToggleAvailability = async (vehicleId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isAvailable: !currentStatus
        })
      })

      if (response.ok) {
        setVehicles(vehicles.map(v => 
          v.id === vehicleId 
            ? { ...v, isAvailable: !currentStatus }
            : v
        ))
      } else {
        alert('Błąd podczas zmiany statusu pojazdu')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Błąd podczas zmiany statusu pojazdu')
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'ALL' || vehicle.type === filterType
    const matchesAvailability = 
      filterAvailability === 'ALL' ||
      (filterAvailability === 'AVAILABLE' && vehicle.isAvailable) ||
      (filterAvailability === 'UNAVAILABLE' && !vehicle.isAvailable)

    return matchesSearch && matchesType && matchesAvailability
  })

  const getVehicleTypeText = (type: string) => {
    switch (type) {
      case 'CAR': return 'Samochód'
      case 'BIKE': return 'Rower'
      case 'SCOOTER': return 'Hulajnoga'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie pojazdów...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Zarządzanie pojazdami</h1>
              <p className="mt-1 text-sm text-gray-500">
                Dodawaj, edytuj i zarządzaj flotą pojazdów
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                ← Powrót do panelu
              </button>
              <button
                onClick={() => window.location.href = '/admin/vehicles/new'}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Dodaj pojazd
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
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

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              Znaleziono: {filteredVehicles.length} pojazdów
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pojazd
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejestracja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokalizacja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena/dzień
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16">
                          <img
                            className="h-12 w-16 rounded-md object-cover"
                            src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.year} • {vehicle.color}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getVehicleTypeText(vehicle.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {vehicle.licensePlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.pricePerDay} PLN
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(vehicle.id, vehicle.isAvailable)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vehicle.isAvailable
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {vehicle.isAvailable ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Dostępny
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Niedostępny
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.location.href = `/admin/vehicles/${vehicle.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Zobacz szczegóły"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/vehicles/${vehicle.id}/edit`}
                          className="text-orange-600 hover:text-orange-900"
                          title="Edytuj"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Usuń"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Brak pojazdów</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'ALL' || filterAvailability !== 'ALL'
                  ? 'Nie znaleziono pojazdów spełniających kryteria wyszukiwania.'
                  : 'Rozpocznij od dodania pierwszego pojazdu do floty.'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/admin/vehicles/new'}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Dodaj pojazd
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredVehicles.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{filteredVehicles.length}</div>
              <div className="text-sm text-gray-500">Łącznie pojazdów</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredVehicles.filter(v => v.isAvailable).length}
              </div>
              <div className="text-sm text-gray-500">Dostępnych</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">
                {filteredVehicles.filter(v => !v.isAvailable).length}
              </div>
              <div className="text-sm text-gray-500">Niedostępnych</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(filteredVehicles.reduce((sum, v) => sum + v.pricePerDay, 0) / filteredVehicles.length)}
              </div>
              <div className="text-sm text-gray-500">Średnia cena PLN/dzień</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

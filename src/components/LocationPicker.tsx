'use client'

import { useState } from 'react'
import VehicleMap from './VehicleMap'
import { MapPinIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface LocationPickerProps {
  selectedLocation: string
  onLocationChange: (location: string) => void
  label: string
  required?: boolean
  showMap?: boolean
}

const LOCATIONS = [
  'Warszawa Centrum',
  'Warszawa Lotnisko', 
  'Kraków Centrum',
  'Gdańsk Centrum',
  'Wrocław Centrum',
  'Poznań Centrum'
]

const LOCATION_DETAILS = {
  'Warszawa Centrum': {
    address: 'ul. Marszałkowska 1, 00-001 Warszawa',
    hours: '24/7',
    phone: '+48 22 123 45 67',
    coordinates: { lat: 52.2297, lng: 21.0122 }
  },
  'Warszawa Lotnisko': {
    address: 'Lotnisko Chopina, Terminal A, 00-906 Warszawa',
    hours: '24/7',
    phone: '+48 22 123 45 68',
    coordinates: { lat: 52.1657, lng: 20.9671 }
  },
  'Kraków Centrum': {
    address: 'Rynek Główny 1, 31-042 Kraków',
    hours: '6:00 - 22:00',
    phone: '+48 12 123 45 67',
    coordinates: { lat: 50.0647, lng: 19.9450 }
  },
  'Gdańsk Centrum': {
    address: 'ul. Długa 1, 80-827 Gdańsk',
    hours: '6:00 - 22:00',
    phone: '+48 58 123 45 67',
    coordinates: { lat: 54.3520, lng: 18.6466 }
  },
  'Wrocław Centrum': {
    address: 'Rynek 1, 50-101 Wrocław',
    hours: '6:00 - 22:00',
    phone: '+48 71 123 45 67',
    coordinates: { lat: 51.1079, lng: 17.0385 }
  },
  'Poznań Centrum': {
    address: 'Stary Rynek 1, 61-772 Poznań',
    hours: '6:00 - 22:00',
    phone: '+48 61 123 45 67',
    coordinates: { lat: 52.4064, lng: 16.9252 }
  }
}

export default function LocationPicker({ 
  selectedLocation, 
  onLocationChange, 
  label, 
  required = false,
  showMap = false 
}: LocationPickerProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showMapView, setShowMapView] = useState(showMap)

  const handleLocationSelect = (location: string) => {
    onLocationChange(location)
    setShowDetails(true)
  }

  const selectedLocationDetails = selectedLocation ? LOCATION_DETAILS[selectedLocation as keyof typeof LOCATION_DETAILS] : null

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Location Selector */}
      <div className="relative">
        <select
          value={selectedLocation}
          onChange={(e) => handleLocationSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
          required={required}
        >
          <option value="">Wybierz lokalizację</option>
          {LOCATIONS.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>

      {/* Location Details */}
      {selectedLocationDetails && showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-orange-600" />
                {selectedLocation}
              </h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Adres:</span> {selectedLocationDetails.address}
                </div>
                <div>
                  <span className="font-medium">Godziny:</span> {selectedLocationDetails.hours}
                </div>
                <div>
                  <span className="font-medium">Telefon:</span> {selectedLocationDetails.phone}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowMapView(!showMapView)}
              className="ml-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {showMapView ? 'Ukryj mapę' : 'Pokaż mapę'}
            </button>
          </div>
        </div>
      )}

      {/* Map View */}
      {showMapView && selectedLocation && (
        <div className="border rounded-lg overflow-hidden">
          <VehicleMap
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            height="300px"
            showVehicles={false}
            showLocationPicker={true}
          />
        </div>
      )}

      {/* Quick Location Info */}
      {!showDetails && selectedLocation && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 text-blue-600" />
            <span>
              <strong>{selectedLocation}</strong> - {selectedLocationDetails?.address}
            </span>
          </div>
        </div>
      )}

      {/* Location Tips */}
      {!selectedLocation && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
          <h5 className="font-medium text-gray-700 mb-1">Dostępne lokalizacje:</h5>
          <ul className="space-y-1">
            {LOCATIONS.map(location => (
              <li key={location} className="flex items-center">
                <MapPinIcon className="h-3 w-3 mr-2 text-gray-400" />
                {location}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

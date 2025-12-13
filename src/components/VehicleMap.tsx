'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MapPinIcon, TruckIcon } from '@heroicons/react/24/outline'

interface Vehicle {
  id: string
  type: string
  brand: string
  model: string
  location: string
  isAvailable: boolean
  pricePerDay: number
  images: string[]
  coordinates?: {
    lat: number
    lng: number
  }
}

interface VehicleMapProps {
  vehicles?: Vehicle[]
  selectedLocation?: string
  onLocationSelect?: (location: string, coordinates: { lat: number; lng: number }) => void
  height?: string
  showVehicles?: boolean
  showLocationPicker?: boolean
}

// Predefiniowane lokalizacje z współrzędnymi
const LOCATIONS = {
  'Warszawa Centrum': { lat: 52.2297, lng: 21.0122 },
  'Warszawa Lotnisko': { lat: 52.1657, lng: 20.9671 },
  'Kraków Centrum': { lat: 50.0647, lng: 19.9450 },
  'Gdańsk Centrum': { lat: 54.3520, lng: 18.6466 },
  'Wrocław Centrum': { lat: 51.1079, lng: 17.0385 },
  'Poznań Centrum': { lat: 52.4064, lng: 16.9252 }
}

export default function VehicleMap({ 
  vehicles = [], 
  selectedLocation,
  onLocationSelect,
  height = '400px',
  showVehicles = true,
  showLocationPicker = false
}: VehicleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
        })

        // @ts-ignore - Loader API compatibility
        await (loader as any).load()

        if (!mapRef.current) return

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 52.2297, lng: 21.0122 }, // Warszawa jako domyślne centrum
          zoom: 6,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        setMap(mapInstance)
        setLoading(false)
      } catch (err) {
        console.error('Error loading Google Maps:', err)
        setError('Nie udało się załadować mapy. Sprawdź klucz API Google Maps.')
        setLoading(false)
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (!map) return

    // Usuń istniejące markery
    markers.forEach(marker => marker.setMap(null))
    setMarkers([])

    const newMarkers: google.maps.Marker[] = []

    if (showVehicles && vehicles.length > 0) {
      // Dodaj markery dla pojazdów
      vehicles.forEach(vehicle => {
        const coordinates = vehicle.coordinates || LOCATIONS[vehicle.location as keyof typeof LOCATIONS]
        
        if (coordinates) {
          const marker = new google.maps.Marker({
            position: coordinates,
            map: map,
            title: `${vehicle.brand} ${vehicle.model}`,
            icon: {
              url: getVehicleIcon(vehicle.type, vehicle.isAvailable),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40)
            }
          })

          // Info window z szczegółami pojazdu
          const infoWindow = new google.maps.InfoWindow({
            content: createVehicleInfoContent(vehicle)
          })

          marker.addListener('click', () => {
            // Zamknij inne info windows
            newMarkers.forEach(m => {
              const iw = (m as any).infoWindow
              if (iw) iw.close()
            })
            
            infoWindow.open(map, marker)
            ;(marker as any).infoWindow = infoWindow
          })

          ;(marker as any).infoWindow = infoWindow
          newMarkers.push(marker)
        }
      })
    }

    if (showLocationPicker) {
      // Dodaj markery dla wszystkich dostępnych lokalizacji
      Object.entries(LOCATIONS).forEach(([locationName, coordinates]) => {
        const isSelected = selectedLocation === locationName
        
        const marker = new google.maps.Marker({
          position: coordinates,
          map: map,
          title: locationName,
          icon: {
            url: isSelected ? '/icons/location-selected.svg' : '/icons/location.svg',
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32)
          }
        })

        marker.addListener('click', () => {
          if (onLocationSelect) {
            onLocationSelect(locationName, coordinates)
          }
        })

        newMarkers.push(marker)
      })
    }

    setMarkers(newMarkers)

    // Dostosuj widok mapy do markerów
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      newMarkers.forEach(marker => {
        const position = marker.getPosition()
        if (position) bounds.extend(position)
      })
      map.fitBounds(bounds)
      
      // Ustaw maksymalny zoom
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 15) {
          map.setZoom(15)
        }
        google.maps.event.removeListener(listener)
      })
    }
  }, [map, vehicles, selectedLocation, showVehicles, showLocationPicker, onLocationSelect])

  const getVehicleIcon = (type: string, isAvailable: boolean) => {
    const baseColor = isAvailable ? 'green' : 'red'
    
    switch (type) {
      case 'CAR':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="${baseColor}" stroke="white" stroke-width="2"/>
            <path d="M12 18h16l-2-4H14l-2 4zm0 0v6h2v2h2v-2h8v2h2v-2h2v-6H12z" fill="white"/>
          </svg>
        `)}`
      case 'BIKE':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="${baseColor}" stroke="white" stroke-width="2"/>
            <circle cx="14" cy="24" r="3" fill="none" stroke="white" stroke-width="1.5"/>
            <circle cx="26" cy="24" r="3" fill="none" stroke="white" stroke-width="1.5"/>
            <path d="M14 24l6-8h4l2 4M20 16l-2 8" stroke="white" stroke-width="1.5" fill="none"/>
          </svg>
        `)}`
      case 'SCOOTER':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="${baseColor}" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="26" r="2" fill="none" stroke="white" stroke-width="1.5"/>
            <circle cx="24" cy="26" r="2" fill="none" stroke="white" stroke-width="1.5"/>
            <path d="M16 26h8M20 14v8M18 14h4" stroke="white" stroke-width="1.5" fill="none"/>
          </svg>
        `)}`
      default:
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="${baseColor}" stroke="white" stroke-width="2"/>
            <path d="M20 12v16M12 20h16" stroke="white" stroke-width="2"/>
          </svg>
        `)}`
    }
  }

  const createVehicleInfoContent = (vehicle: Vehicle) => {
    const statusText = vehicle.isAvailable ? 'Dostępny' : 'Niedostępny'
    const statusColor = vehicle.isAvailable ? 'text-green-600' : 'text-red-600'
    const vehicleTypeText = vehicle.type === 'CAR' ? 'Samochód' : 
                           vehicle.type === 'BIKE' ? 'Rower' : 'Hulajnoga'

    return `
      <div style="padding: 12px; min-width: 200px;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <img src="${Array.isArray(vehicle.images) ? vehicle.images[0] : '/placeholder-vehicle.jpg'}"
               alt="${vehicle.brand} ${vehicle.model}"
               style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${vehicle.brand} ${vehicle.model}
            </h3>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              ${vehicleTypeText}
            </p>
          </div>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="font-size: 14px; color: #374151;">Lokalizacja: </span>
          <span style="font-size: 14px; font-weight: 500; color: #1f2937;">${vehicle.location}</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="font-size: 14px; color: #374151;">Status: </span>
          <span style="font-size: 14px; font-weight: 500;" class="${statusColor}">${statusText}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="font-size: 14px; color: #374151;">Cena: </span>
          <span style="font-size: 16px; font-weight: 600; color: #ea580c;">${vehicle.pricePerDay} PLN/dzień</span>
        </div>
        ${vehicle.isAvailable ? `
          <button onclick="window.location.href='/booking?vehicleId=${vehicle.id}'" 
                  style="width: 100%; padding: 8px 16px; background-color: #ea580c; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
            Zarezerwuj teraz
          </button>
        ` : ''}
      </div>
    `
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Ładowanie mapy...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full rounded-lg border border-gray-200"
        style={{ height }}
      />
      
      {/* Legenda */}
      {showVehicles && vehicles.length > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Legenda</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span>Dostępne</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span>Niedostępne</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

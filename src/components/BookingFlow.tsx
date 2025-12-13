'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { FIBONACCI, GOLDEN_RATIO } from '@/utils/goldenRatioLayout'

interface Vehicle {
  id: string
  type: 'CAR' | 'BIKE' | 'SCOOTER'
  make: string
  model: string
  year: number
  pricePerDay: number
  available: boolean
  features: string[]
  imageUrl?: string
}

interface BookingData {
  vehicleId: string
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  dropoffDate: string
  pickupTime: string
  dropoffTime: string
  totalDays: number
  totalPrice: number
  customerInfo?: {
    name: string
    email: string
    phone: string
    drivingLicense: string
  }
}

const BOOKING_STEPS = [
  { id: 1, name: 'Wybór pojazdu', description: 'Wybierz idealny pojazd' },
  { id: 2, name: 'Szczegóły rezerwacji', description: 'Potwierdź daty i lokalizację' },
  { id: 3, name: 'Dane osobowe', description: 'Podaj swoje dane kontaktowe' },
  { id: 4, name: 'Podsumowanie', description: 'Sprawdź i potwierdź rezerwację' }
]

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      if (data.success) {
        setVehicles(data.data.filter((v: Vehicle) => v.available))
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = (vehicle: Vehicle, days: number) => {
    return vehicle.pricePerDay * days
  }

  const nextStep = () => {
    if (currentStep < BOOKING_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setBookingData(prev => ({
      ...prev,
      vehicleId: vehicle.id
    }))
  }

  const handleBookingSubmit = async () => {
    if (!selectedVehicle || !bookingData.customerInfo) return

    try {
      setLoading(true)
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          vehicleId: selectedVehicle.id,
          totalPrice: calculateTotalPrice(selectedVehicle, bookingData.totalDays || 1)
        }),
      })

      if (response.ok) {
        alert('Rezerwacja została złożona pomyślnie!')
        // Reset form or redirect
      } else {
        alert('Wystąpił błąd podczas składania rezerwacji')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('Wystąpił błąd podczas składania rezerwacji')
    } finally {
      setLoading(false)
    }
  }

  const StepIndicator = () => (
    <div 
      className="flex items-center justify-center mb-8"
      style={{ marginBottom: `${FIBONACCI[5]}rem` }}
    >
      {BOOKING_STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center rounded-full transition-all duration-300 ${
              currentStep >= step.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
            style={{
              width: `${FIBONACCI[6]}rem`,
              height: `${FIBONACCI[6]}rem`,
              fontSize: `${FIBONACCI[3] / GOLDEN_RATIO}rem`
            }}
          >
            {currentStep > step.id ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              step.id
            )}
          </div>
          
          {index < BOOKING_STEPS.length - 1 && (
            <div
              className={`h-1 transition-all duration-300 ${
                currentStep > step.id ? 'bg-orange-500' : 'bg-gray-200'
              }`}
              style={{ width: `${FIBONACCI[7]}rem` }}
            />
          )}
        </div>
      ))}
    </div>
  )

  const VehicleSelectionStep = () => (
    <div className="space-y-6">
      <h2 
        className="text-2xl font-bold text-center text-gray-900 mb-6"
        style={{ 
          fontSize: `${FIBONACCI[5] / GOLDEN_RATIO}rem`,
          marginBottom: `${FIBONACCI[4]}rem`
        }}
      >
        Wybierz pojazd
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie pojazdów...</p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ gap: `${FIBONACCI[4]}rem` }}
        >
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedVehicle?.id === vehicle.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              style={{
                padding: `${FIBONACCI[4]}rem`,
                borderRadius: `${FIBONACCI[3]}rem`
              }}
              onClick={() => handleVehicleSelect(vehicle)}
            >
              <div className="text-center">
                <h3 
                  className="font-semibold text-gray-900 mb-2"
                  style={{ 
                    fontSize: `${FIBONACCI[4] / GOLDEN_RATIO}rem`,
                    marginBottom: `${FIBONACCI[3]}rem`
                  }}
                >
                  {vehicle.make} {vehicle.model}
                </h3>
                <p 
                  className="text-gray-600 mb-4"
                  style={{ marginBottom: `${FIBONACCI[3]}rem` }}
                >
                  {vehicle.year} • {vehicle.type}
                </p>
                <p 
                  className="text-2xl font-bold text-orange-600 mb-4"
                  style={{ 
                    fontSize: `${FIBONACCI[5] / GOLDEN_RATIO}rem`,
                    marginBottom: `${FIBONACCI[3]}rem`
                  }}
                >
                  {vehicle.pricePerDay} zł/dzień
                </p>
                
                <div className="space-y-2">
                  {(Array.isArray(vehicle.features) ? vehicle.features : []).slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const BookingDetailsStep = () => (
    <div className="space-y-6">
      <h2 
        className="text-2xl font-bold text-center text-gray-900 mb-6"
        style={{ 
          fontSize: `${FIBONACCI[5] / GOLDEN_RATIO}rem`,
          marginBottom: `${FIBONACCI[4]}rem`
        }}
      >
        Szczegóły rezerwacji
      </h2>
      
      {selectedVehicle && (
        <div 
          className="bg-gray-50 rounded-lg p-6 mb-6"
          style={{
            padding: `${FIBONACCI[4]}rem`,
            borderRadius: `${FIBONACCI[3]}rem`,
            marginBottom: `${FIBONACCI[4]}rem`
          }}
        >
          <h3 className="font-semibold text-gray-900 mb-2">
            Wybrany pojazd: {selectedVehicle.make} {selectedVehicle.model}
          </h3>
          <p className="text-orange-600 font-bold">
            {selectedVehicle.pricePerDay} zł/dzień
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miejsce odbioru
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            value={bookingData.pickupLocation || ''}
            onChange={(e) => setBookingData(prev => ({ ...prev, pickupLocation: e.target.value }))}
          >
            <option value="">Wybierz miasto</option>
            <option value="warszawa">Warszawa</option>
            <option value="krakow">Kraków</option>
            <option value="gdansk">Gdańsk</option>
            <option value="wroclaw">Wrocław</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miejsce zwrotu
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            value={bookingData.dropoffLocation || ''}
            onChange={(e) => setBookingData(prev => ({ ...prev, dropoffLocation: e.target.value }))}
          >
            <option value="">Wybierz miasto</option>
            <option value="warszawa">Warszawa</option>
            <option value="krakow">Kraków</option>
            <option value="gdansk">Gdańsk</option>
            <option value="wroclaw">Wrocław</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data odbioru
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            value={bookingData.pickupDate || ''}
            onChange={(e) => setBookingData(prev => ({ ...prev, pickupDate: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data zwrotu
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            value={bookingData.dropoffDate || ''}
            onChange={(e) => setBookingData(prev => ({ ...prev, dropoffDate: e.target.value }))}
          />
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <VehicleSelectionStep />
      case 2:
        return <BookingDetailsStep />
      case 3:
        return <div>Dane osobowe - TODO</div>
      case 4:
        return <div>Podsumowanie - TODO</div>
      default:
        return <VehicleSelectionStep />
    }
  }

  return (
    <div 
      className="max-w-6xl mx-auto px-4 py-8"
      style={{ 
        padding: `${FIBONACCI[5]}rem ${FIBONACCI[4]}rem`,
        maxWidth: `${FIBONACCI[10] * GOLDEN_RATIO}px`
      }}
    >
      <StepIndicator />
      
      <div 
        className="bg-white rounded-lg shadow-lg p-8"
        style={{
          padding: `${FIBONACCI[5]}rem`,
          borderRadius: `${FIBONACCI[4]}rem`
        }}
      >
        {renderCurrentStep()}
        
        {/* Navigation buttons */}
        <div 
          className="flex justify-between mt-8"
          style={{ marginTop: `${FIBONACCI[5]}rem` }}
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            style={{
              padding: `${FIBONACCI[3]}rem ${FIBONACCI[4]}rem`,
              borderRadius: `${FIBONACCI[2]}rem`
            }}
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Wstecz
          </button>
          
          <button
            onClick={currentStep === BOOKING_STEPS.length ? handleBookingSubmit : nextStep}
            disabled={!selectedVehicle && currentStep === 1}
            className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            style={{
              padding: `${FIBONACCI[3]}rem ${FIBONACCI[4]}rem`,
              borderRadius: `${FIBONACCI[2]}rem`
            }}
          >
            {currentStep === BOOKING_STEPS.length ? 'Potwierdź rezerwację' : 'Dalej'}
            {currentStep < BOOKING_STEPS.length && <ChevronRightIcon className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  )
}

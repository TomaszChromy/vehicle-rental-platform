'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CalendarIcon, ClockIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import LocationPicker from '@/components/LocationPicker'

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
}

interface BookingData {
  vehicleId: string
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string
  pickupTime: string
  returnTime: string
}

function BookingForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const vehicleId = searchParams.get('vehicleId')
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1: Details, 2: Summary, 3: Payment
  
  const [bookingData, setBookingData] = useState<BookingData>({
    vehicleId: vehicleId || '',
    startDate: '',
    endDate: '',
    pickupLocation: '',
    returnLocation: '',
    pickupTime: '09:00',
    returnTime: '18:00'
  })

  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    drivingLicense: ''
  })

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  const fetchVehicle = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      if (data.success) {
        const selectedVehicle = data.data.find((v: Vehicle) => v.id === vehicleId)
        setVehicle(selectedVehicle || null)
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!vehicle || !bookingData.startDate || !bookingData.endDate) return 0
    
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    return Math.max(1, days) * vehicle.pricePerDay
  }

  const handleBookingSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()
      
      if (data.success) {
        // Redirect to success page
        router.push(`/booking/success?bookingId=${data.data.id}`)
      } else {
        alert('Błąd podczas tworzenia rezerwacji: ' + data.error)
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Wystąpił błąd podczas rezerwacji')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pojazd nie znaleziony</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700"
          >
            Powrót do strony głównej
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepNumber ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {stepNumber === 1 && 'Szczegóły'}
                  {stepNumber === 2 && 'Podsumowanie'}
                  {stepNumber === 3 && 'Płatność'}
                </span>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    step > stepNumber ? 'bg-orange-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {vehicle.brand} {vehicle.model}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>Rok: {vehicle.year}</p>
                <p>Kolor: {vehicle.color}</p>
                <p>Lokalizacja: {vehicle.location}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Cena za dzień:</span>
                  <span className="font-semibold">{vehicle.pricePerDay} PLN</span>
                </div>
                
                {bookingData.startDate && bookingData.endDate && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Liczba dni:</span>
                      <span className="font-semibold">
                        {Math.max(1, Math.ceil((new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24)))}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-bold text-orange-600 border-t pt-2">
                      <span>Łączna cena:</span>
                      <span>{calculateTotalPrice()} PLN</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Szczegóły rezerwacji</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Data odbioru
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Data zwrotu
                      </label>
                      <input
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                        min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="w-4 h-4 inline mr-1" />
                        Godzina odbioru
                      </label>
                      <select
                        value={bookingData.pickupTime}
                        onChange={(e) => setBookingData({...bookingData, pickupTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {Array.from({length: 12}, (_, i) => {
                          const hour = i + 8
                          const time = `${hour.toString().padStart(2, '0')}:00`
                          return (
                            <option key={time} value={time}>{time}</option>
                          )
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="w-4 h-4 inline mr-1" />
                        Godzina zwrotu
                      </label>
                      <select
                        value={bookingData.returnTime}
                        onChange={(e) => setBookingData({...bookingData, returnTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {Array.from({length: 12}, (_, i) => {
                          const hour = i + 8
                          const time = `${hour.toString().padStart(2, '0')}:00`
                          return (
                            <option key={time} value={time}>{time}</option>
                          )
                        })}
                      </select>
                    </div>

                    {/* Location Selection */}
                    <div className="md:col-span-2">
                      <LocationPicker
                        selectedLocation={bookingData.pickupLocation}
                        onLocationChange={(location) => setBookingData({...bookingData, pickupLocation: location})}
                        label="Miejsce odbioru"
                        required={true}
                        showMap={false}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <LocationPicker
                        selectedLocation={bookingData.returnLocation}
                        onLocationChange={(location) => setBookingData({...bookingData, returnLocation: location})}
                        label="Miejsce zwrotu (opcjonalne)"
                        required={false}
                        showMap={false}
                      />
                    </div>

                    {/* Informacja o zwrocie */}
                    {!bookingData.returnLocation && (
                      <div className="md:col-span-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                        <MapPinIcon className="h-4 w-4 inline mr-1 text-blue-600" />
                        Jeśli nie wybierzesz miejsca zwrotu, pojazd zostanie zwrócony w tym samym miejscu co odbiór.
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!bookingData.startDate || !bookingData.endDate || !bookingData.pickupLocation}
                      className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Dalej
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dane osobowe</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imię
                      </label>
                      <input
                        type="text"
                        value={customerData.firstName}
                        onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nazwisko
                      </label>
                      <input
                        type="text"
                        value={customerData.lastName}
                        onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numer prawa jazdy
                      </label>
                      <input
                        type="text"
                        value={customerData.drivingLicense}
                        onChange={(e) => setCustomerData({...customerData, drivingLicense: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                    >
                      Wstecz
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone}
                      className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Dalej
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Podsumowanie i płatność</h2>
                  
                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Podsumowanie rezerwacji</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Pojazd:</span>
                        <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Okres wynajmu:</span>
                        <span className="font-medium">
                          {new Date(bookingData.startDate).toLocaleDateString('pl-PL')} - {new Date(bookingData.endDate).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Godziny:</span>
                        <span className="font-medium">{bookingData.pickupTime} - {bookingData.returnTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Miejsce odbioru:</span>
                        <span className="font-medium">{bookingData.pickupLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Miejsce zwrotu:</span>
                        <span className="font-medium">{bookingData.returnLocation || bookingData.pickupLocation}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-lg font-bold">Łączna cena:</span>
                        <span className="text-lg font-bold text-orange-600">{calculateTotalPrice()} PLN</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Metoda płatności</h3>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center">
                        <CreditCardIcon className="w-6 h-6 text-gray-400 mr-3" />
                        <span>Karta płatnicza (Stripe)</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Bezpieczna płatność kartą kredytową lub debetową
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                    >
                      Wstecz
                    </button>
                    <button
                      onClick={handleBookingSubmit}
                      disabled={submitting}
                      className="bg-orange-600 text-white px-8 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Przetwarzanie...' : 'Potwierdź rezerwację'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Ładowanie...</p>
        </div>
      </div>
    }>
      <BookingForm />
    </Suspense>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircleIcon, CalendarIcon, ClockIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline'

interface Booking {
  id: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  pickupLocation: string
  returnLocation: string
  pickupTime: string
  returnTime: string
  vehicle: {
    id: string
    type: string
    brand: string
    model: string
    licensePlate: string
  }
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')
  
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      if (data.success) {
        const foundBooking = data.data.find((b: Booking) => b.id === bookingId)
        setBooking(foundBooking || null)
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
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

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Rezerwacja nie znaleziona</h1>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rezerwacja potwierdzona!
          </h1>
          <p className="text-lg text-gray-600">
            Dziękujemy za wybór naszej platformy. Szczegóły rezerwacji zostały wysłane na Twój email.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-orange-600 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Szczegóły rezerwacji</h2>
            <p className="text-orange-100">Numer rezerwacji: {booking.id}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Vehicle Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pojazd</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.vehicle.brand} {booking.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      Typ: {booking.vehicle.type} • Rejestracja: {booking.vehicle.licensePlate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {booking.totalPrice} PLN
                    </p>
                    <p className="text-sm text-gray-600">Łączna cena</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Dates */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Daty wynajmu
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Od:</span>
                    <span className="font-medium">
                      {new Date(booking.startDate).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Do:</span>
                    <span className="font-medium">
                      {new Date(booking.endDate).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Times */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Godziny
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Odbiór:</span>
                    <span className="font-medium">{booking.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zwrot:</span>
                    <span className="font-medium">{booking.returnTime}</span>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Lokalizacje
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 block">Miejsce odbioru:</span>
                    <span className="font-medium">{booking.pickupLocation}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Miejsce zwrotu:</span>
                    <span className="font-medium">{booking.returnLocation || booking.pickupLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Dane klienta</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{booking.user.firstName} {booking.user.lastName}</p>
                <p className="text-gray-600">{booking.user.email}</p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Status rezerwacji</h4>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'PENDING' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'CONFIRMED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status === 'PENDING' && 'Oczekuje na potwierdzenie'}
                  {booking.status === 'CONFIRMED' && 'Potwierdzona'}
                  {booking.status === 'ACTIVE' && 'Aktywna'}
                  {booking.status === 'COMPLETED' && 'Zakończona'}
                  {booking.status === 'CANCELLED' && 'Anulowana'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Ważne informacje</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Prosimy o przybycie 15 minut przed wyznaczoną godziną odbioru</li>
            <li>• Przy odbiorze pojazdu wymagane jest prawo jazdy i dokument tożsamości</li>
            <li>• Szczegóły dotyczące lokalizacji odbioru zostały wysłane na Twój email</li>
            <li>• W przypadku pytań skontaktuj się z nami pod numerem: +48 123 456 789</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Drukuj potwierdzenie
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Powrót do strony głównej
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-gray-600">
          <p>Masz pytania? Skontaktuj się z nami:</p>
          <p className="font-medium">Email: kontakt@vehiclerental.pl | Telefon: +48 123 456 789</p>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Ładowanie...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}

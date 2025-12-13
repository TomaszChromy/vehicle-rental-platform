'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  ClockIcon,
  ArrowLeftIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

interface Booking {
  id: string
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string | null
  totalPrice: number
  status: string
  createdAt: string
  vehicle: {
    id: string
    brand: string
    model: string
    type: string
    imageUrl: string
    pricePerDay: number
  }
  payment: {
    status: string
    amount: number
  } | null
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile/bookings')
      return
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchBookings()
    }
  }, [status, session, router])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACTIVE': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Potwierdzona'
      case 'PENDING': return 'Oczekująca'
      case 'ACTIVE': return 'Aktywna'
      case 'COMPLETED': return 'Zakończona'
      case 'CANCELLED': return 'Anulowana'
      default: return status
    }
  }

  const getVehicleTypeText = (type: string) => {
    switch (type) {
      case 'CAR': return 'Samochód'
      case 'BIKE': return 'Rower'
      case 'SCOOTER': return 'Hulajnoga'
      default: return type
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PAID': return 'Opłacona'
      case 'PENDING': return 'Oczekująca'
      case 'FAILED': return 'Nieudana'
      case 'REFUNDED': return 'Zwrócona'
      default: return status
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true
    return booking.status === filter
  })

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/profile"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Powrót do profilu
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Historia rezerwacji</h1>
            <p className="mt-1 text-sm text-gray-600">
              Przeglądaj wszystkie swoje rezerwacje i ich statusy
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-4">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtruj według statusu:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm"
                >
                  <option value="ALL">Wszystkie</option>
                  <option value="PENDING">Oczekujące</option>
                  <option value="CONFIRMED">Potwierdzone</option>
                  <option value="ACTIVE">Aktywne</option>
                  <option value="COMPLETED">Zakończone</option>
                  <option value="CANCELLED">Anulowane</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {filter === 'ALL' ? 'Brak rezerwacji' : `Brak rezerwacji o statusie "${getStatusText(filter)}"`}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === 'ALL' 
                      ? 'Nie masz jeszcze żadnych rezerwacji.'
                      : 'Spróbuj zmienić filtr lub utwórz nową rezerwację.'
                    }
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/booking"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Zarezerwuj pojazd
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={booking.vehicle.imageUrl}
                            alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {booking.vehicle.brand} {booking.vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {getVehicleTypeText(booking.vehicle.type)}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                <span>
                                  {new Date(booking.startDate).toLocaleDateString('pl-PL')} - {new Date(booking.endDate).toLocaleDateString('pl-PL')}
                                </span>
                              </div>
                              
                              <div className="flex items-center text-gray-600">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                <span>{calculateDays(booking.startDate, booking.endDate)} dni</span>
                              </div>
                              
                              <div className="flex items-center text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-2" />
                                <span>
                                  {booking.pickupLocation}
                                  {booking.returnLocation && booking.returnLocation !== booking.pickupLocation && 
                                    ` → ${booking.returnLocation}`
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center text-gray-600">
                                <CreditCardIcon className="h-4 w-4 mr-2" />
                                <span>{booking.totalPrice.toFixed(2)} zł</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          
                          {booking.payment && (
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                                {getPaymentStatusText(booking.payment.status)}
                              </span>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-500">
                            Utworzona: {new Date(booking.createdAt).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          ID rezerwacji: {booking.id.slice(0, 8)}...
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {booking.status === 'PENDING' && (
                            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                              Anuluj
                            </button>
                          )}
                          
                          <Link
                            href={`/profile/bookings/${booking.id}`}
                            className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                          >
                            Zobacz szczegóły
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          {bookings.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Łączne rezerwacje
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {bookings.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Aktywne
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {bookings.filter(b => b.status === 'ACTIVE' || b.status === 'CONFIRMED').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CreditCardIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Łączna kwota
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {bookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toFixed(2)} zł
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <MapPinIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Zakończone
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {bookings.filter(b => b.status === 'COMPLETED').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

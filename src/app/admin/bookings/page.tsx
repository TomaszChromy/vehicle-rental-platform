'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface Booking {
  id: string
  userId: string
  vehicleId: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  pickupLocation: string
  returnLocation: string
  pickupTime: string
  returnTime: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  vehicle: {
    id: string
    type: string
    brand: string
    model: string
    licensePlate: string
    images: string[]
  }
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPayment, setFilterPayment] = useState('ALL')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      if (data.success) {
        setBookings(data.data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        ))
        alert('Status rezerwacji został zaktualizowany')
      } else {
        alert('Błąd podczas aktualizacji statusu')
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Błąd podczas aktualizacji statusu')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus
    const matchesPayment = filterPayment === 'ALL' || booking.paymentStatus === filterPayment

    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Oczekuje'
      case 'CONFIRMED': return 'Potwierdzona'
      case 'ACTIVE': return 'Aktywna'
      case 'COMPLETED': return 'Zakończona'
      case 'CANCELLED': return 'Anulowana'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Oczekuje'
      case 'PAID': return 'Opłacona'
      case 'FAILED': return 'Nieudana'
      case 'REFUNDED': return 'Zwrócona'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie rezerwacji...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Zarządzanie rezerwacjami</h1>
              <p className="mt-1 text-sm text-gray-500">
                Przeglądaj i zarządzaj wszystkimi rezerwacjami
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                ← Powrót do panelu
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
                placeholder="Szukaj rezerwacji..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="ALL">Wszystkie statusy</option>
              <option value="PENDING">Oczekujące</option>
              <option value="CONFIRMED">Potwierdzone</option>
              <option value="ACTIVE">Aktywne</option>
              <option value="COMPLETED">Zakończone</option>
              <option value="CANCELLED">Anulowane</option>
            </select>

            {/* Payment Filter */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="ALL">Wszystkie płatności</option>
              <option value="PENDING">Oczekujące</option>
              <option value="PAID">Opłacone</option>
              <option value="FAILED">Nieudane</option>
              <option value="REFUNDED">Zwrócone</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              Znaleziono: {filteredBookings.length} rezerwacji
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pojazd
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Okres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokalizacja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Płatność
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user.firstName} {booking.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-14">
                          <img
                            className="h-10 w-14 rounded object-cover"
                            src={booking.vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                            alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.vehicle.brand} {booking.vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getVehicleTypeText(booking.vehicle.type)} • {booking.vehicle.licensePlate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(booking.startDate).toLocaleDateString('pl-PL')}
                        </div>
                        <div className="flex items-center mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(booking.endDate).toLocaleDateString('pl-PL')}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {booking.pickupTime} - {booking.returnTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Odbiór: {booking.pickupLocation}</div>
                        <div className="text-gray-500">
                          Zwrot: {booking.returnLocation || booking.pickupLocation}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.totalPrice} PLN
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(booking.status)}`}
                      >
                        <option value="PENDING">Oczekuje</option>
                        <option value="CONFIRMED">Potwierdzona</option>
                        <option value="ACTIVE">Aktywna</option>
                        <option value="COMPLETED">Zakończona</option>
                        <option value="CANCELLED">Anulowana</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {getPaymentStatusText(booking.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.location.href = `/admin/bookings/${booking.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Zobacz szczegóły"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                              className="text-green-600 hover:text-green-900"
                              title="Potwierdź"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                              className="text-red-600 hover:text-red-900"
                              title="Anuluj"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Brak rezerwacji</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'ALL' || filterPayment !== 'ALL'
                  ? 'Nie znaleziono rezerwacji spełniających kryteria wyszukiwania.'
                  : 'Nie ma jeszcze żadnych rezerwacji w systemie.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredBookings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{filteredBookings.length}</div>
              <div className="text-sm text-gray-500">Łącznie rezerwacji</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredBookings.filter(b => b.status === 'PENDING').length}
              </div>
              <div className="text-sm text-gray-500">Oczekujących</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-500">Aktywnych</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">
                {filteredBookings.filter(b => b.paymentStatus === 'PAID').length}
              </div>
              <div className="text-sm text-gray-500">Opłaconych</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Łączny przychód PLN</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

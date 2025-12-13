'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TruckIcon, 
  CalendarIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalVehicles: number
  availableVehicles: number
  totalBookings: number
  pendingBookings: number
  completedBookings: number
  totalRevenue: number
  todayBookings: number
  activeUsers: number
}

interface RecentBooking {
  id: string
  vehicle: {
    brand: string
    model: string
    type: string
  }
  user: {
    firstName: string
    lastName: string
    email: string
  }
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    activeUsers: 0
  })
  
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch vehicles
      const vehiclesResponse = await fetch('/api/vehicles')
      const vehiclesData = await vehiclesResponse.json()
      
      // Fetch bookings
      const bookingsResponse = await fetch('/api/bookings')
      const bookingsData = await bookingsResponse.json()
      
      if (vehiclesData.success && bookingsData.success) {
        const vehicles = vehiclesData.data
        const bookings = bookingsData.data
        
        // Calculate stats
        const totalVehicles = vehicles.length
        const availableVehicles = vehicles.filter((v: any) => v.isAvailable).length
        const totalBookings = bookings.length
        const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING').length
        const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED').length
        const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0)
        
        // Today's bookings
        const today = new Date().toISOString().split('T')[0]
        const todayBookings = bookings.filter((b: any) => 
          b.createdAt.split('T')[0] === today
        ).length
        
        // Unique users count
        const uniqueUsers = new Set(bookings.map((b: any) => b.userId)).size
        
        setStats({
          totalVehicles,
          availableVehicles,
          totalBookings,
          pendingBookings,
          completedBookings,
          totalRevenue,
          todayBookings,
          activeUsers: uniqueUsers
        })
        
        // Set recent bookings (last 5)
        const sortedBookings = bookings
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
        setRecentBookings(sortedBookings)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100'
      case 'ACTIVE': return 'text-green-600 bg-green-100'
      case 'COMPLETED': return 'text-gray-600 bg-gray-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie panelu administratora...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-gray-900/95 shadow-2xl border-b border-gray-700 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Panel Administratora</h1>
              <p className="mt-2 text-gray-300 text-lg">
                Zarządzanie platformą wynajmu pojazdów
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/admin/vehicles'}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-400 hover:to-red-400 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Zarządzaj pojazdami
              </button>
              <button
                onClick={() => window.location.href = '/admin/bookings'}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Zarządzaj rezerwacjami
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Vehicles */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Łączna liczba pojazdów</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVehicles}</p>
                <p className="text-sm text-green-600">{stats.availableVehicles} dostępnych</p>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Łączne rezerwacje</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                <p className="text-sm text-yellow-600">{stats.pendingBookings} oczekujących</p>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Łączny przychód</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRevenue.toLocaleString()} PLN</p>
                <p className="text-sm text-green-600">{stats.completedBookings} zakończonych</p>
              </div>
            </div>
          </div>

          {/* Today's Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Dzisiejsze rezerwacje</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.todayBookings}</p>
                <p className="text-sm text-blue-600">{stats.activeUsers} aktywnych użytkowników</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Najnowsze rezerwacje</h2>
          </div>
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
                    Cena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data utworzenia
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user.firstName} {booking.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{booking.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.vehicle.brand} {booking.vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">{booking.vehicle.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.startDate).toLocaleDateString('pl-PL')} - {new Date(booking.endDate).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.totalPrice} PLN
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString('pl-PL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Brak rezerwacji do wyświetlenia</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/admin/vehicles/new'}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                + Dodaj nowy pojazd
              </button>
              <button
                onClick={() => window.location.href = '/admin/users'}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                👥 Zarządzaj użytkownikami
              </button>
              <button
                onClick={() => window.location.href = '/admin/reports'}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                📊 Generuj raporty
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status systemu</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Baza danych: Online</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">API: Działające</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Płatności: Gotowe</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ostatnia aktywność</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Nowa rezerwacja: 2 min temu</p>
              <p>• Zaktualizowano pojazd: 15 min temu</p>
              <p>• Nowy użytkownik: 1 godz. temu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: string
  createdAt: string
  _count: {
    bookings: number
  }
}

interface RecentBooking {
  id: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  vehicle: {
    brand: string
    model: string
    type: string
    imageUrl: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile')
      return
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile()
      fetchRecentBookings()
    }
  }, [status, session, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${session?.user?.id}&limit=3`)
      if (response.ok) {
        const data = await response.json()
        setRecentBookings(data.bookings || [])
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
            <h1 className="text-3xl font-bold text-gray-900">Mój profil</h1>
            <p className="mt-1 text-sm text-gray-600">
              Zarządzaj swoimi danymi osobowymi i przeglądaj historię rezerwacji
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Informacje osobiste
                    </h3>
                    <Link
                      href="/profile/edit"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edytuj
                    </Link>
                  </div>

                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Imię i nazwisko
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile?.firstName} {profile?.lastName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile?.email}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        Telefon
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile?.phone || 'Nie podano'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Data rejestracji
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('pl-PL') : '-'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="mt-6 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Ostatnie rezerwacje
                    </h3>
                    <Link
                      href="/profile/bookings"
                      className="text-sm font-medium text-orange-600 hover:text-orange-500"
                    >
                      Zobacz wszystkie
                    </Link>
                  </div>

                  {recentBookings.length === 0 ? (
                    <div className="text-center py-6">
                      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Brak rezerwacji</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Nie masz jeszcze żadnych rezerwacji.
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
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={booking.vehicle.imageUrl}
                                alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {booking.vehicle.brand} {booking.vehicle.model}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {getVehicleTypeText(booking.vehicle.type)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(booking.startDate).toLocaleDateString('pl-PL')} - {new Date(booking.endDate).toLocaleDateString('pl-PL')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {booking.totalPrice.toFixed(2)} zł
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Statystyki
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Łączne rezerwacje
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        {profile?._count?.bookings || 0}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Status konta
                      </dt>
                      <dd className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktywne
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Typ konta
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile?.role === 'CLIENT' ? 'Klient' : profile?.role}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Szybkie akcje
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/booking"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Nowa rezerwacja
                    </Link>
                    <Link
                      href="/map"
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Mapa pojazdów
                    </Link>
                    <Link
                      href="/profile/bookings"
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Historia rezerwacji
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

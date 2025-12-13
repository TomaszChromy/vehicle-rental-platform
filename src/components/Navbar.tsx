'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  MapPinIcon,
  CalendarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const navigation = [
    { name: 'Strona główna', href: '/' },
    { name: 'Mapa pojazdów', href: '/map', icon: MapPinIcon },
    { name: 'Rezerwacja', href: '/booking', icon: CalendarIcon },
  ]

  const userNavigation = [
    { name: 'Mój profil', href: '/profile', icon: UserIcon },
    { name: 'Moje rezerwacje', href: '/profile/bookings', icon: CalendarIcon },
    { name: 'Ustawienia', href: '/profile/settings', icon: Cog6ToothIcon },
  ]

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-2xl border-b border-gray-700/50 backdrop-blur-xl relative">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group">
                {/* Modern logo icon */}
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-red-400 transition-all duration-300">
                  VehicleRent
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-transparent hover:border-gray-600"
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === 'loading' ? (
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gradient-to-r from-orange-400 to-red-500 h-10 w-10"></div>
              </div>
            ) : session ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-orange-500 to-red-500 flex text-sm rounded-full focus:outline-none focus:ring-4 focus:ring-orange-500/50 hover:from-orange-400 hover:to-red-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <span className="sr-only">Otwórz menu użytkownika</span>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {session.user.firstName?.[0]}{session.user.lastName?.[0]}
                      </span>
                    </div>
                  </button>
                </div>

                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl py-2 bg-gray-900 ring-1 ring-gray-600 focus:outline-none z-50 border border-gray-700">
                    <div className="px-4 py-3 text-sm border-b border-white/10">
                      <div className="font-bold text-white">{session.user.firstName} {session.user.lastName}</div>
                      <div className="text-gray-300">{session.user.email}</div>
                    </div>
                    
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl mx-2 transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                    
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-3" />
                        Panel Admin
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleSignOut()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Wyloguj się
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-sm font-semibold flex items-center transition-all duration-300 border border-transparent hover:border-gray-600"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Zaloguj się
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Otwórz menu główne</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
          
          {session ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {session.user.firstName?.[0]}{session.user.lastName?.[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session.user.firstName} {session.user.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
                
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center px-4 py-2 text-base font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-3" />
                    Panel Admin
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    setIsOpen(false)
                    handleSignOut()
                  }}
                  className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Wyloguj się
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  href="/auth/signin"
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Zaloguj się
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center px-4 py-2 text-base font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlusIcon className="h-5 w-5 mr-3" />
                  Zarejestruj się
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

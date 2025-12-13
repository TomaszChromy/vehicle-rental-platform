'use client'

import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
    firstName: string
    lastName: string
  }
  vehicle: {
    type: string
    brand: string
    model: string
  }
}

export default function Testimonial() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?featured=true&limit=3')
      const data = await response.json()
      if (data.success) {
        setReviews(data.data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const generateAvatar = (userId: string, userName: string) => {
    // Generate a hash from user ID to select a realistic photo
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)

    // Array of realistic portrait photos from Unsplash
    const avatarPhotos = [
      'photo-1507003211169-0a1dd7228f2d', // Man with beard
      'photo-1494790108755-2616c6d4e6e8', // Woman smiling
      'photo-1472099645785-5658abf4ff4e', // Man in suit
      'photo-1438761681033-6461ffad8d80', // Woman professional
      'photo-1500648767791-00dcc994a43e', // Man casual
      'photo-1544005313-94ddf0286df2', // Woman with glasses
      'photo-1506794778202-cad84cf45f1d', // Man outdoor
      'photo-1534528741775-53994a69daeb', // Woman business
      'photo-1519085360753-af0119f7cbe7', // Man young
      'photo-1517841905240-472988babdf9', // Woman casual
    ]

    const selectedPhoto = avatarPhotos[Math.abs(hash) % avatarPhotos.length]

    return (
      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
        <img
          src={`https://images.unsplash.com/${selectedPhoto}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80`}
          alt={`${userName} avatar`}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }
  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Opinie klientów
            </h2>
            <p className="text-lg text-gray-600">
              Ładowanie...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Opinie klientów
            </h2>
            <p className="text-lg text-gray-600">
              Brak opinii do wyświetlenia
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20 scroll-reveal">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30 mb-6">
            <span className="text-orange-600 text-sm font-semibold">⭐ Opinie Klientów</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Opinie
            </span>
            <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent">
              zadowolonych klientów
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Zobacz co mówią o nas klienci, którzy już skorzystali z naszych usług.
            <span className="text-orange-600 font-semibold">Ponad 10,000 zadowolonych użytkowników!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="group relative scroll-reveal">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-0 group-hover:opacity-25 transition duration-1000"></div>

              <div className="relative bg-white/95 rounded-3xl shadow-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200 hover:bg-white hover:shadow-orange-500/20 card-hover">
              {/* User Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-xl ring-4 ring-white/50">
                    <img
                      src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80`}
                      alt={`${review.user.name} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Quote icon overlay */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-6 space-x-1">
                {renderStars(review.rating)}
              </div>

              {/* Review text */}
              <blockquote className="text-gray-800 mb-8 text-center text-lg leading-relaxed font-medium italic">
                &ldquo;{review.comment}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center pt-4 border-t border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {review.user.name}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {review.vehicle.brand} {review.vehicle.model}
                  </div>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

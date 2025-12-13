import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reviews - Get all reviews with user and vehicle info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const featured = searchParams.get('featured') === 'true'

    const whereClause: any = {}
    
    if (vehicleId) {
      whereClause.vehicleId = vehicleId
    }

    if (featured) {
      whereClause.rating = { gte: 4 }
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        vehicle: {
          select: {
            type: true,
            brand: true,
            model: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    // Format reviews for frontend
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        name: `${review.user.firstName} ${review.user.lastName}`,
        firstName: review.user.firstName,
        lastName: review.user.lastName
      },
      vehicle: review.vehicle
    }))

    return NextResponse.json({
      success: true,
      data: formattedReviews,
      count: formattedReviews.length
    })

  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      vehicleId,
      bookingId,
      rating,
      comment
    } = body

    // Validate required fields
    if (!userId || !vehicleId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, vehicleId, rating' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Check if booking exists (if provided)
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      })

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      // Check if booking belongs to user and vehicle
      if (booking.userId !== userId || booking.vehicleId !== vehicleId) {
        return NextResponse.json(
          { error: 'Booking does not match user and vehicle' },
          { status: 400 }
        )
      }
    }

    const review = await prisma.review.create({
      data: {
        userId,
        vehicleId,
        rating: parseInt(rating),
        comment: comment || null
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        vehicle: {
          select: {
            type: true,
            brand: true,
            model: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          name: `${review.user.firstName} ${review.user.lastName}`
        },
        vehicle: review.vehicle
      },
      message: 'Review created successfully'
    })

  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vehicles - Get all vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const available = searchParams.get('available')

    let whereClause: any = {}

    if (type) {
      whereClause.type = type.toUpperCase()
    }

    if (location) {
      whereClause.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    if (available === 'true') {
      whereClause.isAvailable = true
    }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate average rating for each vehicle
    const vehiclesWithRating = vehicles.map(vehicle => {
      const totalRating = vehicle.reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = vehicle.reviews.length > 0 ? totalRating / vehicle.reviews.length : 0

      return {
        ...vehicle,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: vehicle._count.reviews,
        totalBookings: vehicle._count.bookings,
        reviews: undefined, // Remove reviews from response
        _count: undefined
      }
    })

    return NextResponse.json({
      success: true,
      data: vehiclesWithRating
    })

  } catch (error) {
    console.error('Vehicles fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

// POST /api/vehicles - Create new vehicle (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      brand,
      model,
      year,
      licensePlate,
      color,
      description,
      pricePerDay,
      location,
      features = [],
      images = []
    } = body

    // Validate required fields
    if (!type || !brand || !model || !year || !licensePlate || !pricePerDay || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate vehicle type
    const validTypes = ['CAR', 'BIKE', 'SCOOTER']
    if (!validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid vehicle type' },
        { status: 400 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        type: type.toUpperCase(),
        brand,
        model,
        year: parseInt(year),
        licensePlate,
        color,
        description,
        pricePerDay: parseFloat(pricePerDay),
        location,
        features: Array.isArray(features) ? features.join(',') : features,
        images: Array.isArray(images) ? images.join(',') : images
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicle,
      message: 'Vehicle created successfully'
    })

  } catch (error) {
    console.error('Vehicle creation error:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'License plate already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}

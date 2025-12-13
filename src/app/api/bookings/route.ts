import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bookings - Get user bookings
export async function GET(request: NextRequest) {
  try {
    // For now, we'll return mock data since we don't have authentication yet
    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            type: true,
            brand: true,
            model: true,
            licensePlate: true,
            images: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      vehicleId,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      pickupTime,
      returnTime,
      userId = 'temp-user-id' // Temporary until we have auth
    } = body

    // Validate required fields
    if (!vehicleId || !startDate || !endDate || !pickupLocation || !pickupTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if vehicle exists and is available
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    if (!vehicle.isAvailable) {
      return NextResponse.json(
        { error: 'Vehicle is not available' },
        { status: 400 }
      )
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        vehicleId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'ACTIVE']
        },
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } }
            ]
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } }
            ]
          },
          {
            AND: [
              { startDate: { gte: new Date(startDate) } },
              { endDate: { lte: new Date(endDate) } }
            ]
          }
        ]
      }
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Vehicle is already booked for the selected dates' },
        { status: 409 }
      )
    }

    // Calculate total price
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = days * vehicle.pricePerDay

    // Create temporary user if doesn't exist
    let user = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'temp@example.com',
          firstName: 'Temp',
          lastName: 'User',
          password: 'temp-password'
        }
      })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        vehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        pickupLocation,
        returnLocation: returnLocation || pickupLocation,
        pickupTime,
        returnTime: returnTime || pickupTime,
        status: 'PENDING'
      },
      include: {
        vehicle: {
          select: {
            id: true,
            type: true,
            brand: true,
            model: true,
            licensePlate: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

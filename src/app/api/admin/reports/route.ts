import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString()
    const to = searchParams.get('to') || new Date().toISOString()

    // Total bookings
    const totalBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to)
        }
      }
    })

    // Total revenue
    const bookingsWithTotal = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to)
        }
      },
      select: {
        totalPrice: true
      }
    })

    const totalRevenue = bookingsWithTotal.reduce((sum, booking) => sum + booking.totalPrice, 0)

    // Total vehicles
    const totalVehicles = await prisma.vehicle.count()

    // Total users
    const totalUsers = await prisma.user.count()

    // Bookings by month
    const bookingsByMonth = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as count,
        SUM(totalPrice) as revenue
      FROM Booking 
      WHERE createdAt >= ${new Date(from)} AND createdAt <= ${new Date(to)}
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month
    ` as Array<{ month: string; count: number; revenue: number }>

    // Vehicles by type
    const vehiclesByType = await prisma.$queryRaw`
      SELECT 
        v.type,
        COUNT(DISTINCT v.id) as count,
        COALESCE(SUM(b.totalPrice), 0) as revenue
      FROM Vehicle v
      LEFT JOIN Booking b ON v.id = b.vehicleId 
        AND b.createdAt >= ${new Date(from)} 
        AND b.createdAt <= ${new Date(to)}
      GROUP BY v.type
    ` as Array<{ type: string; count: number; revenue: number }>

    // Top users
    const topUsers = await prisma.$queryRaw`
      SELECT 
        u.firstName || ' ' || u.lastName as name,
        u.email,
        COUNT(b.id) as bookings,
        COALESCE(SUM(b.totalPrice), 0) as revenue
      FROM User u
      LEFT JOIN Booking b ON u.id = b.userId 
        AND b.createdAt >= ${new Date(from)} 
        AND b.createdAt <= ${new Date(to)}
      WHERE u.role = 'CLIENT'
      GROUP BY u.id, u.firstName, u.lastName, u.email
      HAVING COUNT(b.id) > 0
      ORDER BY revenue DESC
      LIMIT 10
    ` as Array<{ name: string; email: string; bookings: number; revenue: number }>

    const reportData = {
      totalBookings,
      totalRevenue,
      totalVehicles,
      totalUsers,
      bookingsByMonth: bookingsByMonth.map(item => ({
        ...item,
        count: Number(item.count),
        revenue: Number(item.revenue)
      })),
      vehiclesByType: vehiclesByType.map(item => ({
        ...item,
        count: Number(item.count),
        revenue: Number(item.revenue)
      })),
      topUsers: topUsers.map(item => ({
        ...item,
        bookings: Number(item.bookings),
        revenue: Number(item.revenue)
      }))
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

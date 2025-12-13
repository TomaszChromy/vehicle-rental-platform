import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/plans - Get all subscription plans
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: plans
    })

  } catch (error) {
    console.error('Plans fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

// POST /api/plans - Create new plan (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      price,
      currency = 'PLN',
      duration = 'monthly',
      features = []
    } = body

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price' },
        { status: 400 }
      )
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Validate duration
    const validDurations = ['monthly', 'yearly']
    if (!validDurations.includes(duration)) {
      return NextResponse.json(
        { error: 'Duration must be either "monthly" or "yearly"' },
        { status: 400 }
      )
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        price: typeof price === 'number' ? price : parseFloat(price),
        currency,
        duration,
        features: Array.isArray(features) ? features.join(',') : ''
      }
    })

    return NextResponse.json({
      success: true,
      data: plan,
      message: 'Plan created successfully'
    })

  } catch (error) {
    console.error('Plan creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    )
  }
}

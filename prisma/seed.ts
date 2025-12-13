import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create users with hashed passwords
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@vehiclerent.pl' },
      update: {},
      create: {
        email: 'admin@vehiclerent.pl',
        firstName: 'Admin',
        lastName: 'User',
        password: await bcrypt.hash('admin123', 12),
        role: 'ADMIN',
        phone: '+48123456789'
      }
    }),
    prisma.user.upsert({
      where: { email: 'manager@vehiclerent.pl' },
      update: {},
      create: {
        email: 'manager@vehiclerent.pl',
        firstName: 'Manager',
        lastName: 'User',
        password: await bcrypt.hash('manager123', 12),
        role: 'MANAGER',
        phone: '+48123456790'
      }
    }),
    prisma.user.upsert({
      where: { email: 'jan.kowalski@example.com' },
      update: {},
      create: {
        email: 'jan.kowalski@example.com',
        firstName: 'Jan',
        lastName: 'Kowalski',
        password: await bcrypt.hash('user123', 12),
        role: 'CLIENT',
        phone: '+48123456791'
      }
    }),
    prisma.user.upsert({
      where: { email: 'anna.nowak@example.com' },
      update: {},
      create: {
        email: 'anna.nowak@example.com',
        firstName: 'Anna',
        lastName: 'Nowak',
        password: await bcrypt.hash('user123', 12),
        role: 'CLIENT',
        phone: '+48123456792'
      }
    })
  ])

  console.log('✅ Users created')

  // Create vehicles
  const vehicles = await Promise.all([
    // Cars
    prisma.vehicle.upsert({
      where: { licensePlate: 'WA12345' },
      update: {},
      create: {
        type: 'CAR',
        brand: 'Skoda',
        model: 'Octavia',
        year: 2022,
        licensePlate: 'WA12345',
        color: 'Pomarańczowy',
        description: 'Komfortowy samochód osobowy idealny na dłuższe trasy',
        pricePerDay: 120,
        location: 'Warszawa Centrum',
        features: 'Klimatyzacja,GPS,Bluetooth,Automatyczna skrzynia',
        images: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        isAvailable: true
      }
    }),
    prisma.vehicle.upsert({
      where: { licensePlate: 'KR67890' },
      update: {},
      create: {
        type: 'CAR',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2021,
        licensePlate: 'KR67890',
        color: 'Srebrny',
        description: 'Ekonomiczny samochód miejski',
        pricePerDay: 100,
        location: 'Kraków Centrum',
        features: 'Klimatyzacja,Radio,Bluetooth',
        images: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        isAvailable: true
      }
    }),
    
    // Bikes
    prisma.vehicle.upsert({
      where: { licensePlate: 'BIKE001' },
      update: {},
      create: {
        type: 'BIKE',
        brand: 'Trek',
        model: 'City Bike',
        year: 2023,
        licensePlate: 'BIKE001',
        color: 'Niebieski',
        description: 'Wygodny rower miejski z koszykiem',
        pricePerDay: 40,
        location: 'Warszawa Centrum',
        features: 'Koszyk,7 biegów,Oświetlenie LED,Blokada',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        isAvailable: true
      }
    }),
    prisma.vehicle.upsert({
      where: { licensePlate: 'BIKE002' },
      update: {},
      create: {
        type: 'BIKE',
        brand: 'Giant',
        model: 'Escape',
        year: 2023,
        licensePlate: 'BIKE002',
        color: 'Czerwony',
        description: 'Sportowy rower hybrydowy',
        pricePerDay: 45,
        location: 'Kraków Centrum',
        features: '21 biegów,Amortyzacja,Oświetlenie,Licznik',
        images: 'https://images.unsplash.com/photo-1544191696-15693072b5a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        isAvailable: true
      }
    }),
    
    // Scooters
    prisma.vehicle.upsert({
      where: { licensePlate: 'SCOOT001' },
      update: {},
      create: {
        type: 'SCOOTER',
        brand: 'Xiaomi',
        model: 'Mi Electric Scooter',
        year: 2023,
        licensePlate: 'SCOOT001',
        color: 'Czarny',
        description: 'Elektryczna hulajnoga z długim zasięgiem',
        pricePerDay: 30,
        location: 'Warszawa Centrum',
        features: 'Zasięg 30km,Składana,Oświetlenie LED,Aplikacja',
        images: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        isAvailable: true
      }
    }),
    prisma.vehicle.upsert({
      where: { licensePlate: 'SCOOT002' },
      update: {},
      create: {
        type: 'SCOOTER',
        brand: 'Ninebot',
        model: 'KickScooter',
        year: 2023,
        licensePlate: 'SCOOT002',
        color: 'Biały',
        description: 'Lekka hulajnoga elektryczna',
        pricePerDay: 35,
        location: 'Gdańsk Centrum',
        features: 'Zasięg 25km,Wodoodporna,Cruise control,Hamulce',
        images: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        isAvailable: true
      }
    })
  ])

  console.log('✅ Vehicles created')

  // Create subscription plans
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { id: 'basic-plan' },
      update: {},
      create: {
        id: 'basic-plan',
        name: 'Podstawowy',
        price: 200,
        duration: 'monthly',
        features: 'Funkcjonalność 1,Funkcjonalność 2,Funkcjonalność 3'
      }
    }),
    prisma.plan.upsert({
      where: { id: 'standard-plan' },
      update: {},
      create: {
        id: 'standard-plan',
        name: 'Standardowy',
        price: 350,
        duration: 'monthly',
        features: 'Funkcjonalność 1,Funkcjonalność 2,Funkcjonalność 3'
      }
    }),
    prisma.plan.upsert({
      where: { id: 'premium-plan' },
      update: {},
      create: {
        id: 'premium-plan',
        name: 'Premium',
        price: 500,
        duration: 'monthly',
        features: 'Funkcjonalność 1,Funkcjonalność 2,Funkcjonalność 3'
      }
    })
  ])

  console.log('✅ Plans created')

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: users[2].id, // Jan Kowalski
        vehicleId: vehicles[0].id, // Skoda Octavia
        rating: 5,
        comment: 'Świetny samochód, bardzo wygodny i ekonomiczny!'
      }
    }),
    prisma.review.create({
      data: {
        userId: users[3].id, // Anna Nowak
        vehicleId: vehicles[2].id, // Trek Bike
        rating: 4,
        comment: 'Dobry rower, polecam na krótkie trasy po mieście.'
      }
    })
  ])

  console.log('✅ Reviews created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

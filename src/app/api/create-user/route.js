import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  const body = await request.json()
  const { name, email, password } = body

  // Basic validation
  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: 'Name, email, and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    })

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('User creation failed:', error)

    // Prisma error for unique constraint violation
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Email already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
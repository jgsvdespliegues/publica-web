import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateUniqueSlug, generateVerificationToken } from '@/lib/utils'
// import { sendVerificationEmail } from '@/lib/resend' // Comentado temporalmente

export async function POST(request: NextRequest) {
  try {
    const { storeName, email, password } = await request.json()

    // Validaciones básicas
    if (!storeName || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingAuth = await prisma.storeAuth.findUnique({
      where: { email }
    })

    if (existingAuth) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Generar slug único para la tienda
    const slug = await generateUniqueSlug(storeName)

    // Hash de la contraseña
    const passwordHash = await hashPassword(password)

    // Generar token de verificación
    const verificationToken = generateVerificationToken()

    // Crear tienda y autenticación en una transacción
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      // Crear la tienda
      const store = await tx.store.create({
        data: {
          name: storeName,
          slug
        }
      })

      // Crear la autenticación (verificada automáticamente en desarrollo)
      const storeAuth = await tx.storeAuth.create({
        data: {
          storeId: store.id,
          email,
          passwordHash,
          verificationToken,
          isVerified: process.env.NODE_ENV === 'development' ? true : false
        }
      })

      return { store, storeAuth }
    })

    // Comentado temporalmente - envío de email de verificación
    // const emailSent = await sendVerificationEmail(email, verificationToken, slug)
    
    // Simular que el email se envió exitosamente en desarrollo
    const emailSent = process.env.NODE_ENV === 'development' ? true : false

    if (!emailSent && process.env.NODE_ENV !== 'development') {
      console.error('Error enviando email de verificación')
      // No bloquear el registro si falla el email
    }

    return NextResponse.json({
      message: 'Tienda creada exitosamente',
      store: {
        id: result.store.id,
        name: result.store.name,
        slug: result.store.slug
      },
      verificationRequired: process.env.NODE_ENV !== 'development'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando tienda:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
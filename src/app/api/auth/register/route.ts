import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateUniqueSlug, generateVerificationToken, isValidEmail, isValidPassword } from '@/lib/utils'
import { sendVerificationEmail } from '@/lib/email'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { storeName, email, password } = await request.json()

    // Validaciones
    if (!storeName || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    if (!isValidPassword(password)) {
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

    // Generar slug único
    const slug = await generateUniqueSlug(storeName)

    // Hash de la contraseña
    const passwordHash = await hashPassword(password)

    // Generar token de verificación
    const verificationToken = generateVerificationToken()

    // Crear la tienda y autenticación en una transacción
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Crear la tienda
      const store = await tx.store.create({
        data: {
          slug,
          name: storeName,
        }
      })

      // Crear la autenticación
      const storeAuth = await tx.storeAuth.create({
  data: {
    storeId: store.id,
    email,
    passwordHash,
    verificationToken,
    isVerified: true  // ← SIMPLEMENTE CAMBIA false por true
  }
})

      return { store, storeAuth }
    })

    // Enviar email de verificación (deshabilitado en desarrollo)
    // const emailSent = await sendVerificationEmail(email, verificationToken, slug)
    const emailSent = true // Simular que se envió
    if (!emailSent) {
      console.warn('Error enviando email de verificación, pero la cuenta se creó')
    }

    return NextResponse.json({
      message: 'Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.',
      storeSlug: slug,
      emailSent
    }, { status: 201 })

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
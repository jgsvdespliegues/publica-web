import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const storeSlug = searchParams.get('store')

    if (!token || !email || !storeSlug) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 }
      )
    }

    // Buscar la autenticación por email y token
    const storeAuth = await prisma.storeAuth.findFirst({
      where: {
        email,
        verificationToken: token,
        isVerified: false
      },
      include: {
        store: true
      }
    })

    if (!storeAuth) {
      return NextResponse.json(
        { error: 'Token inválido o cuenta ya verificada' },
        { status: 400 }
      )
    }

    // Verificar la cuenta
    await prisma.storeAuth.update({
      where: { id: storeAuth.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    })

    // Enviar email de bienvenida
    await sendWelcomeEmail(email, storeAuth.store.name, storeAuth.store.slug)

    // Redirigir a página de éxito
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/${storeSlug}/admin?verified=true`
    )

  } catch (error) {
    console.error('Error en verificación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
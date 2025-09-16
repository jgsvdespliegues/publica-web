import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// Interfaces para tipar los request bodies
interface CreateCardBody {
  title: string;
  description: string;
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
}

interface UpdateCardBody {
  id: string;
  title: string;
  description: string;
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
}

// GET - Obtener cards de una tienda
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeSlug = searchParams.get('store')

    if (!storeSlug) {
      return NextResponse.json(
        { error: 'Store slug es requerido' },
        { status: 400 }
      )
    }

    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      include: {
        cards: {
          orderBy: { orderPosition: 'asc' }
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Tienda no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      store: {
        id: store.id,
        slug: store.slug,
        name: store.name,
        logoUrl: store.logoUrl,
        contactInfo: store.contactInfo,
        instagramUrl: store.instagramUrl,
        whatsappUrl: store.whatsappUrl
      },
      cards: store.cards
    })

  } catch (error) {
    console.error('Error obteniendo cards:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva card
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body: CreateCardBody = await request.json()
    const { title, description, image1Url, image2Url, image3Url } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Título y descripción son obligatorios' },
        { status: 400 }
      )
    }

    // Verificar límite de 10 cards
    const cardCount = await prisma.card.count({
      where: { storeId: session.user.storeId } // ← QUITAMOS (session.user as any)
    })

    if (cardCount >= 10) {
      return NextResponse.json(
        { error: 'Límite de cards máximo alcanzado (10). Por favor, elimina alguna para crear una nueva.' },
        { status: 400 }
      )
    }

    // Obtener la siguiente posición
    const lastCard = await prisma.card.findFirst({
      where: { storeId: session.user.storeId }, // ← QUITAMOS (session.user as any)
      orderBy: { orderPosition: 'desc' }
    })

    const newPosition = lastCard ? lastCard.orderPosition + 1 : 0

    const card = await prisma.card.create({
      data: {
        storeId: session.user.storeId, // ← QUITAMOS (session.user as any)
        title,
        description,
        image1Url: image1Url || null,
        image2Url: image2Url || null,
        image3Url: image3Url || null,
        orderPosition: newPosition
      }
    })

    return NextResponse.json(card, { status: 201 })

  } catch (error) {
    console.error('Error creando card:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar card
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body: UpdateCardBody = await request.json()
    const { id, title, description, image1Url, image2Url, image3Url } = body

    if (!id || !title || !description) {
      return NextResponse.json(
        { error: 'ID, título y descripción son obligatorios' },
        { status: 400 }
      )
    }

    // Verificar que la card pertenece al usuario
    const existingCard = await prisma.card.findFirst({
      where: {
        id,
        storeId: session.user.storeId // ← QUITAMOS (session.user as any)
      }
    })

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Card no encontrada' },
        { status: 404 }
      )
    }

    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        title,
        description,
        image1Url: image1Url || null,
        image2Url: image2Url || null,
        image3Url: image3Url || null,
      }
    })

    return NextResponse.json(updatedCard)

  } catch (error) {
    console.error('Error actualizando card:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar card
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('id')

    if (!cardId) {
      return NextResponse.json(
        { error: 'ID de card es requerido' },
        { status: 400 }
      )
    }

    // Verificar que la card pertenece al usuario
    const existingCard = await prisma.card.findFirst({
      where: {
        id: cardId,
        storeId: session.user.storeId // ← QUITAMOS (session.user as any)
      }
    })

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Card no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar imágenes de Cloudinary si existen
    const imagesToDelete = [
      existingCard.image1Url,
      existingCard.image2Url,
      existingCard.image3Url
    ].filter(Boolean)

    for (const imageUrl of imagesToDelete) {
      if (imageUrl) {
        // Extraer public_id de la URL de Cloudinary
        const publicId = imageUrl.split('/').pop()?.split('.')[0]
        if (publicId) {
          await deleteFromCloudinary(`publica-web/${publicId}`)
        }
      }
    }

    // Eliminar la card
    await prisma.card.delete({
      where: { id: cardId }
    })

    return NextResponse.json({ message: 'Card eliminada exitosamente' })

  } catch (error) {
    console.error('Error eliminando card:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
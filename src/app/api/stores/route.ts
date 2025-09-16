import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// Interface para el body de la request PUT
interface UpdateStoreBody {
  name: string;
  logoUrl?: string;
  contactInfo?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
}

// GET - Obtener información de la tienda
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeSlug = searchParams.get('slug')
    
    if (!storeSlug) {
      return NextResponse.json(
        { error: 'Store slug es requerido' },
        { status: 400 }
      )
    }
    
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug }
    })
    
    if (!store) {
      return NextResponse.json(
        { error: 'Tienda no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      id: store.id,
      slug: store.slug,
      name: store.name,
      logoUrl: store.logoUrl,
      contactInfo: store.contactInfo,
      instagramUrl: store.instagramUrl,
      whatsappUrl: store.whatsappUrl
    })
  } catch (error) {
    console.error('Error obteniendo tienda:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar información de la tienda
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const body: UpdateStoreBody = await request.json()
    const { 
      name, 
      logoUrl, 
      contactInfo, 
      instagramUrl, 
      whatsappUrl 
    } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'El nombre de la tienda es obligatorio' },
        { status: 400 }
      )
    }
    
    // Obtener la tienda actual para comparar el logo
    const currentStore = await prisma.store.findUnique({
      where: { id: session.user.storeId } // ← QUITAMOS (session.user as any)
    })
    
    if (!currentStore) {
      return NextResponse.json(
        { error: 'Tienda no encontrada' },
        { status: 404 }
      )
    }
    
    // Si se cambió el logo, eliminar el anterior de Cloudinary
    if (currentStore.logoUrl && currentStore.logoUrl !== logoUrl) {
      const publicId = currentStore.logoUrl.split('/').pop()?.split('.')[0]
      if (publicId) {
        await deleteFromCloudinary(`publica-web/${publicId}`)
      }
    }
    
    const updatedStore = await prisma.store.update({
      where: { id: session.user.storeId }, // ← QUITAMOS (session.user as any)
      data: {
        name,
        logoUrl: logoUrl || null,
        contactInfo: contactInfo || null,
        instagramUrl: instagramUrl || null,
        whatsappUrl: whatsappUrl || null,
      }
    })
    
    return NextResponse.json({
      id: updatedStore.id,
      slug: updatedStore.slug,
      name: updatedStore.name,
      logoUrl: updatedStore.logoUrl,
      contactInfo: updatedStore.contactInfo,
      instagramUrl: updatedStore.instagramUrl,
      whatsappUrl: updatedStore.whatsappUrl
    })
  } catch (error) {
    console.error('Error actualizando tienda:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
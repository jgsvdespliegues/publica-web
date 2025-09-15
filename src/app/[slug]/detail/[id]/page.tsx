'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Instagram, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StoreData {
  id: string
  slug: string
  name: string
  logoUrl?: string
  contactInfo?: string
  instagramUrl?: string
  whatsappUrl?: string
}

interface CardData {
  id: string
  title: string
  description: string
  image1Url?: string
  image2Url?: string
  image3Url?: string
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const cardId = params.id as string
  
  const [store, setStore] = useState<StoreData | null>(null)
  const [card, setCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de la tienda y todas las cards
        const response = await fetch(`/api/cards?store=${slug}`)
        
        if (!response.ok) {
          throw new Error('Tienda no encontrada')
        }

        const data = await response.json()
        setStore(data.store)
        
        // Buscar la card específica
        const targetCard = data.cards.find((c: CardData) => c.id === cardId)
        
        if (!targetCard) {
          throw new Error('Producto no encontrado')
        }
        
        setCard(targetCard)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, cardId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !store || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'Producto no encontrado' ? 'Producto no encontrado' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error === 'Producto no encontrado' 
              ? 'El producto que buscas no existe o ya no está disponible.'
              : 'Hubo un problema al cargar el contenido.'
            }
          </p>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/${slug}`)}
            >
              Volver a la tienda
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Obtener todas las imágenes disponibles
  const images = [card.image1Url, card.image2Url, card.image3Url].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push(`/${slug}`)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </Button>
            
            <div className="text-center">
              {store.logoUrl ? (
                <Image
                  src={store.logoUrl}
                  alt={`Logo de ${store.name}`}
                  width={80}
                  height={80}
                  className="mx-auto rounded-lg"
                />
              ) : (
                <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
              )}
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">{card.title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Sección de imágenes */}
              <div className="space-y-4">
                {images.length > 0 ? (
                  <>
                    {/* Imagen principal */}
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={images[selectedImageIndex]}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Thumbnails si hay más de una imagen */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-square relative overflow-hidden rounded-md bg-gray-100 border-2 transition-colors ${
                              selectedImageIndex === index 
                                ? 'border-purple-500' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${card.title} - imagen ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Sin imágenes disponibles</p>
                  </div>
                )}
              </div>
              
              {/* Sección de detalles */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                  <div className="prose prose-gray max-w-none">
                    {card.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                {/* Información de contacto */}
                {store.contactInfo && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Información de contacto</h4>
                    <p className="text-gray-700">{store.contactInfo}</p>
                  </div>
                )}
                
                {/* Botones de redes sociales */}
                {(store.instagramUrl || store.whatsappUrl) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Contáctanos</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {store.whatsappUrl && (
                        <a
                          href={store.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex-1"
                        >
                          <MessageCircle size={20} />
                          <span>Consultar por WhatsApp</span>
                        </a>
                      )}
                      
                      {store.instagramUrl && (
                        <a
                          href={store.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow flex-1"
                        >
                          <Instagram size={20} />
                          <span>Seguir en Instagram</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Desarrollado por @vstecnic by Juan G. Soto
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
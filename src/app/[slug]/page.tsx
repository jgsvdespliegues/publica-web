'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, MessageCircle } from 'lucide-react'
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

export default function ClientMainPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [store, setStore] = useState<StoreData | null>(null)
  const [cards, setCards] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`/api/cards?store=${slug}`)
        
        if (!response.ok) {
          throw new Error('Tienda no encontrada')
        }

        const data = await response.json()
        setStore(data.store)
        setCards(data.cards)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tienda no encontrada</h1>
          <p className="text-gray-600 mb-4">
            La tienda que buscas no existe o no está disponible.
          </p>
          <Button onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>
        </div>
      </div>
    )
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getFirstTwoLines = (text: string) => {
    const lines = text.split('\n')
    return lines.slice(0, 2).join('\n')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            {store.logoUrl ? (
              <div className="mb-4">
                <Image
                  src={store.logoUrl}
                  alt={`Logo de ${store.name}`}
                  width={120}
                  height={120}
                  className="mx-auto rounded-lg shadow-md"
                />
              </div>
            ) : (
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
              </div>
            )}
            {store.logoUrl && (
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{store.name}</h1>
            )}
          </div>
        </div>
      </header>

      {/* Cards Section */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Próximamente contenido nuevo
            </h2>
            <p className="text-gray-500">
              Esta tienda está preparando productos increíbles para ti.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {cards.map((card) => (
              <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Imagen preview */}
                    {card.image1Url && (
                      <div className="lg:w-1/3">
                        <Image
                          src={card.image1Url}
                          alt={card.title}
                          width={300}
                          height={200}
                          className="w-full h-48 lg:h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {/* Contenido */}
                    <div className="flex-1">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {truncateText(getFirstTwoLines(card.description))}
                      </p>
                      
                      <Link href={`/${slug}/detail/${card.id}`}>
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          Ver más
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-blue-500 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Información de contacto */}
          {store.contactInfo && (
            <div className="text-center mb-6">
              <h3 className="font-semibold text-slate-800 mb-2">Contacto</h3>
              <p className="text-slate-600">{store.contactInfo}</p>
            </div>
          )}

          {/* Redes sociales */}
          {(store.instagramUrl || store.whatsappUrl) && (
            <div className="flex justify-center space-x-4 mb-6">
              {store.instagramUrl && (
                <a
                  href={store.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow font-semibold"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              )}
              
              {store.whatsappUrl && (
                <a
                  href={store.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow font-semibold"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          )}

          {/* Créditos */}
          <div className="text-center pt-6 border-t border-blue-200 bg-slate-700 rounded-lg px-4 py-3">
            <p className="text-sm text-white font-medium">
              Desarrollado por @vstecnic by Juan G. Soto
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
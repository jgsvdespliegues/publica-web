'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, X, Trash2 } from 'lucide-react'
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

export default function AdminEditPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const slug = params.slug as string
  const editingCardId = searchParams.get('cardId')
  
  const [store, setStore] = useState<StoreData | null>(null)
  const [editingCard, setEditingCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  // Estados del formulario de tienda
  const [storeForm, setStoreForm] = useState({
    name: '',
    logoUrl: '',
    contactInfo: '',
    instagramUrl: '',
    whatsappUrl: ''
  })

  // Estados del formulario de card
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    image1Url: '',
    image2Url: '',
    image3Url: ''
  })

  useEffect(() => {
    if (!session?.user) {
      router.push(`/${slug}/admin`)
      return
    }
    
    fetchData()
  }, [session])

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/cards?store=${slug}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar datos')
      }

      const data = await response.json()
      setStore(data.store)
      
      // Inicializar formulario de tienda
      setStoreForm({
        name: data.store.name || '',
        logoUrl: data.store.logoUrl || '',
        contactInfo: data.store.contactInfo || '',
        instagramUrl: data.store.instagramUrl || '',
        whatsappUrl: data.store.whatsappUrl || ''
      })

      // Si estamos editando una card específica
      if (editingCardId) {
        const card = data.cards.find((c: CardData) => c.id === editingCardId)
        if (card) {
          setEditingCard(card)
          setCardForm({
            title: card.title,
            description: card.description,
            image1Url: card.image1Url || '',
            image2Url: card.image2Url || '',
            image3Url: card.image3Url || ''
          })
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, imageType: string) => {
    setUploadingImage(imageType)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', imageType.includes('logo') ? 'logo' : 'card')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error al subir imagen')
      }

      const data = await response.json()
      
      if (imageType === 'logo') {
        setStoreForm({ ...storeForm, logoUrl: data.url })
      } else {
        setCardForm({ ...cardForm, [imageType]: data.url })
      }
    } catch (error) {
      alert('Error al subir imagen')
    } finally {
      setUploadingImage(null)
    }
  }

  const removeImage = (imageType: string) => {
    if (imageType === 'logo') {
      setStoreForm({ ...storeForm, logoUrl: '' })
    } else {
      setCardForm({ ...cardForm, [imageType]: '' })
    }
  }

  const saveStore = async () => {
    setSaving(true)
    
    try {
      const response = await fetch('/api/stores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeForm),
      })

      if (!response.ok) {
        throw new Error('Error al guardar')
      }

      alert('Información de tienda guardada exitosamente')
    } catch (error) {
      alert('Error al guardar información de tienda')
    } finally {
      setSaving(false)
    }
  }

  const saveCard = async () => {
    if (!cardForm.title.trim() || !cardForm.description.trim()) {
      alert('Título y descripción son obligatorios')
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch('/api/cards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCardId,
          ...cardForm,
          image1Url: cardForm.image1Url || null,
          image2Url: cardForm.image2Url || null,
          image3Url: cardForm.image3Url || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar')
      }

      alert('Card guardada exitosamente')
      router.push(`/${slug}/admin`)
    } catch (error) {
      alert('Error al guardar card')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando editor...</p>
        </div>
      </div>
    )
  }

  const ImageUploadSection = ({ 
    imageUrl, 
    imageType, 
    label 
  }: { 
    imageUrl: string
    imageType: string
    label: string 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {imageUrl ? (
        <div className="relative group">
          <Image
            src={imageUrl}
            alt={label}
            width={120}
            height={120}
            className="rounded-lg object-cover border"
          />
          <button
            type="button"
            onClick={() => removeImage(imageType)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file, imageType)
            }}
            className="hidden"
            id={`upload-${imageType}`}
            disabled={uploadingImage === imageType}
          />
          <label
            htmlFor={`upload-${imageType}`}
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            {uploadingImage === imageType ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            ) : (
              <Upload className="text-gray-400" size={24} />
            )}
            <span className="text-sm text-gray-600">
              {uploadingImage === imageType ? 'Subiendo...' : 'Subir imagen'}
            </span>
          </label>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/${slug}/admin`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Volver al panel</span>
              </Button>
              
              <h1 className="text-2xl font-bold text-gray-900">
                {editingCardId ? 'Editar Card' : 'Editar Tienda'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {editingCardId ? (
          /* Formulario de edición de card */
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Editar Card: {editingCard?.title}</CardTitle>
              <p className="text-gray-600">Modifica la información de tu producto</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la card *
                </label>
                <input
                  type="text"
                  required
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: iPhone 15 Pro Max"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ImageUploadSection 
                  imageUrl={cardForm.image1Url} 
                  imageType="image1Url" 
                  label="Foto 1" 
                />
                <ImageUploadSection 
                  imageUrl={cardForm.image2Url} 
                  imageType="image2Url" 
                  label="Foto 2" 
                />
                <ImageUploadSection 
                  imageUrl={cardForm.image3Url} 
                  imageType="image3Url" 
                  label="Foto 3" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción detallada *
                </label>
                <textarea
                  required
                  value={cardForm.description}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe tu producto con todos los detalles..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${slug}/admin`)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={saveCard}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {saving ? 'Guardando...' : 'Guardar Card'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Formulario de edición de tienda */
          <div className="space-y-8">
            {/* Header Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Header de la tienda</CardTitle>
                <p className="text-gray-600">Configura el logo y nombre de tu tienda</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la tienda *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Tienda de María"
                  />
                </div>

                <ImageUploadSection 
                  imageUrl={storeForm.logoUrl} 
                  imageType="logo" 
                  label="Logo de la tienda (opcional)" 
                />
              </CardContent>
            </Card>

            {/* Footer Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Footer y contacto</CardTitle>
                <p className="text-gray-600">Configura la información de contacto y redes sociales</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Información de contacto
                  </label>
                  <input
                    type="text"
                    value={storeForm.contactInfo}
                    onChange={(e) => setStoreForm({ ...storeForm, contactInfo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Teléfono: +54 9 11 1234-5678 | Email: info@mitienda.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Instagram
                  </label>
                  <input
                    type="url"
                    value={storeForm.instagramUrl}
                    onChange={(e) => setStoreForm({ ...storeForm, instagramUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://instagram.com/tu_usuario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de WhatsApp
                  </label>
                  <input
                    type="url"
                    value={storeForm.whatsappUrl}
                    onChange={(e) => setStoreForm({ ...storeForm, whatsappUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://wa.me/5491112345678"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={saveStore}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </Button>
            </div>
          </div>
        )}
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
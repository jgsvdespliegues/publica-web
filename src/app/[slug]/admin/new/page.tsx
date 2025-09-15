'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminNewCardPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const slug = params.slug as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [cardCount, setCardCount] = useState(0)

  // Estados del formulario
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
    
    checkCardLimit()
  }, [session])

  const checkCardLimit = async () => {
    try {
      const response = await fetch(`/api/cards?store=${slug}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar datos')
      }

      const data = await response.json()
      setCardCount(data.cards.length)
      
      if (data.cards.length >= 10) {
        alert('Has alcanzado el límite de 10 cards. Elimina alguna para crear una nueva.')
        router.push(`/${slug}/admin`)
        return
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
      formData.append('type', 'card')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al subir imagen')
      }

      const data = await response.json()
      setCardForm({ ...cardForm, [imageType]: data.url })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al subir imagen')
    } finally {
      setUploadingImage(null)
    }
  }

  const removeImage = (imageType: string) => {
    setCardForm({ ...cardForm, [imageType]: '' })
  }

  const clearAllFields = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todos los campos?')) {
      setCardForm({
        title: '',
        description: '',
        image1Url: '',
        image2Url: '',
        image3Url: ''
      })
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...cardForm,
          image1Url: cardForm.image1Url || null,
          image2Url: cardForm.image2Url || null,
          image3Url: cardForm.image3Url || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear card')
      }

      alert('Card creada exitosamente')
      router.push(`/${slug}/admin`)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al crear card')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando disponibilidad...</p>
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
              
              <h1 className="text-2xl font-bold text-gray-900">Nueva Card</h1>
            </div>
            
            <div className="text-sm text-gray-600">
              {cardCount + 1}/10 cards
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Crear nueva card</CardTitle>
            <p className="text-gray-600">
              Agrega un nuevo producto a tu tienda. Las imágenes son opcionales.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Título */}
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
                placeholder="Ej: iPhone 15 Pro Max, Remera Nike Air, Torta de Chocolate..."
              />
            </div>

            {/* Imágenes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Imágenes del producto</h3>
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
              <p className="text-sm text-gray-500 mt-2">
                • Las imágenes son opcionales, pero recomendadas para mejor visualización
                • Formatos soportados: JPG, PNG, WebP
                • Tamaño máximo: 5MB por imagen
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción detallada *
              </label>
              <textarea
                required
                value={cardForm.description}
                onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={`Describe tu producto con todos los detalles importantes:

• Características principales
• Precio
• Colores disponibles
• Tallas o medidas
• Estado (nuevo/usado)
• Información de envío
• Cualquier detalle relevante...`}
              />
              <p className="text-sm text-gray-500 mt-1">
                Las primeras dos líneas se mostrarán como preview en la vista principal
              </p>
            </div>

            {/* Preview */}
            {(cardForm.title || cardForm.description) && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Vista previa</h4>
                <div className="bg-white p-4 rounded border">
                  {cardForm.title && (
                    <h5 className="font-semibold text-lg mb-2">{cardForm.title}</h5>
                  )}
                  {cardForm.description && (
                    <p className="text-gray-600 text-sm">
                      {cardForm.description.split('\n').slice(0, 2).join('\n')}
                      {cardForm.description.split('\n').length > 2 && '...'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                onClick={clearAllFields}
                className="flex items-center justify-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 size={16} />
                <span>Limpiar todo</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push(`/${slug}/admin`)}
              >
                Cancelar
              </Button>
              
              <Button
                onClick={saveCard}
                disabled={saving || !cardForm.title.trim() || !cardForm.description.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>{saving ? 'Creando...' : 'Agregar Card'}</span>
              </Button>
            </div>

            {/* Información adicional */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Consejos para tu card:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Usa un título claro y descriptivo</li>
                <li>• Las primeras dos líneas de la descripción son las más importantes</li>
                <li>• Incluye precios, colores, tallas y detalles de envío</li>
                <li>• Las imágenes ayudan mucho a vender, pero no son obligatorias</li>
                <li>• Puedes editar esta card más tarde desde el panel principal</li>
              </ul>
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
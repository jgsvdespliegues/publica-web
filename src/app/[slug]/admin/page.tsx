'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit3, Plus, LogOut, Eye, Trash2, CheckCircle } from 'lucide-react'
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

export default function AdminMainPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const slug = params.slug as string
  
  const [store, setStore] = useState<StoreData | null>(null)
  const [cards, setCards] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [showVerificationAlert, setShowVerificationAlert] = useState(false)

  // Verificar si viene de verificación exitosa
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowVerificationAlert(true)
      // Limpiar el parámetro de la URL
      const newUrl = `/${slug}/admin`
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams, slug])

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      // Usuario logueado, cargar datos
      fetchStoreData()
    } else {
      setLoading(false)
    }
  }, [session, status])

  const fetchStoreData = async () => {
    try {
      const response = await fetch(`/api/cards?store=${slug}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar datos')
      }

      const data = await response.json()
      setStore(data.store)
      setCards(data.cards)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)

    try {
      const result = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        storeSlug: slug,
        redirect: false,
      })

      if (result?.error) {
        setLoginError('Credenciales incorrectas o cuenta no verificada')
      } else if (result?.ok) {
        // Login exitoso, recargar la página
        window.location.reload()
      }
    } catch (error) {
      setLoginError('Error de conexión')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta card?')) {
      return
    }

    try {
      const response = await fetch(`/api/cards?id=${cardId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId))
      } else {
        alert('Error al eliminar la card')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Vista de login
  if (status !== 'loading' && !session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              Acceso Administrativo
            </CardTitle>
            <p className="text-gray-600">Ingresa a tu panel de control</p>
          </CardHeader>
          
          <CardContent>
            {/* Alerta de verificación exitosa */}
            {showVerificationAlert && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <p className="text-green-800 font-medium">
                    ¡Cuenta verificada exitosamente!
                  </p>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Ya puedes acceder a tu panel de administración.
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tu contraseña"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{loginError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loginLoading}
              >
                {loginLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <Link 
                href={`/${slug}`}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                Ver tienda pública
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel...</p>
        </div>
      </div>
    )
  }

  // Vista administrativa
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <header className="bg-surface-primary shadow-lg border-b-2 border-accent-primary">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Mobile Layout */}
          <div className="flex flex-col space-y-4 md:hidden">
            <h1 className="text-2xl font-bold text-accent-primary text-center">Panel de Control</h1>
            {store && (
              <p className="text-center text-text-secondary font-medium">
                {store.name}
              </p>
            )}
            
            <div className="flex space-x-2">
              <Link href={`/${slug}`} target="_blank" className="flex-1">
                <Button variant="outline" className="w-full flex items-center justify-center space-x-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">
                  <Eye size={16} />
                  <span>Ver tienda</span>
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="flex-1 flex items-center justify-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-accent-primary">Panel de Control</h1>
              {store && (
                <span className="text-text-secondary">- {store.name}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href={`/${slug}`} target="_blank">
                <Button variant="outline" className="flex items-center space-x-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">
                  <Eye size={16} />
                  <span>Ver tienda</span>
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Header Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Información de la tienda</CardTitle>
                <p className="text-gray-600 mt-1">Configura el header y footer de tu tienda</p>
              </div>
              <Link href={`/${slug}/admin/edit`}>
                <Button className="flex items-center space-x-2">
                  <Edit3 size={16} />
                  <span>Editar</span>
                </Button>
              </Link>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Header</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {store?.logoUrl ? (
                      <div className="flex items-center space-x-3">
                        <Image
                          src={store.logoUrl}
                          alt="Logo"
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-gray-600">Logo configurado</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">{store?.name}</p>
                        <p className="text-sm text-gray-600">Solo título (sin logo)</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Footer</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <p><strong>Contacto:</strong> {store?.contactInfo || 'No configurado'}</p>
                      <p><strong>Instagram:</strong> {store?.instagramUrl ? 'Configurado' : 'No configurado'}</p>
                      <p><strong>WhatsApp:</strong> {store?.whatsappUrl ? 'Configurado' : 'No configurado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards Section */}
          <Card className="bg-white shadow-lg border-2 border-blue-200">
            <CardHeader className="text-center border-b border-blue-100 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <CardTitle className="text-xl text-blue-600 font-bold">Productos / Cards</CardTitle>
                  <p className="text-slate-600 mt-1">
                    {cards.length}/10 cards creadas
                    {cards.length >= 10 && <span className="text-orange-600 ml-2 font-semibold">• Límite alcanzado</span>}
                  </p>
                </div>
                
                {cards.length < 10 && (
                  <Link href={`/${slug}/admin/new`}>
                    <Button 
                      className="font-semibold px-6 py-2 flex items-center space-x-2 text-white rounded-lg"
                      style={{ backgroundColor: '#3b82f6' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                      <Plus size={16} />
                      <span>Nueva Card</span>
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {cards.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-blue-300 rounded-lg bg-slate-50">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No tienes cards creadas
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Crea tu primera card para comenzar a mostrar productos
                  </p>
                  <Link href={`/${slug}/admin/new`}>
                    <Button 
                      className="font-semibold text-white px-6 py-2 rounded-lg"
                      style={{ backgroundColor: '#3b82f6' }}
                    >
                      <Plus size={16} className="mr-2" />
                      Crear primera card
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {cards.map((card) => (
                    <div key={card.id} className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 bg-slate-50">
                      {/* Título centrado */}
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">{card.title}</h3>
                      </div>
                      
                      {/* Imagen centrada */}
                      {card.image1Url && (
                        <div className="text-center mb-4">
                          <Image
                            src={card.image1Url}
                            alt={card.title}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover border-2 border-blue-300 mx-auto"
                          />
                        </div>
                      )}
                      
                      {/* Descripción centrada */}
                      <div className="text-center mb-6">
                        <p className="text-slate-600 leading-relaxed">
                          {truncateText(card.description)}
                        </p>
                      </div>
                      
                      {/* Botones centrados */}
                      <div className="flex space-x-2">
                        <Link href={`/${slug}/admin/edit?cardId=${card.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full font-medium text-blue-600 border-2 border-blue-500 hover:text-white rounded-lg"
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Editar
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteCard(card.id)}
                          className="flex-1 text-red-600 border-2 border-red-400 hover:bg-red-50 font-medium rounded-lg"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
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
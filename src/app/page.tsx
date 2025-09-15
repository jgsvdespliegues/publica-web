'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Store, Smartphone, Users } from 'lucide-react'

export default function LandingPage() {
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              ¡Registro exitoso!
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 mb-6">
              Hemos enviado un email de verificación a tu correo. 
              Haz clic en el enlace para activar tu cuenta.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Revisa tu bandeja de entrada</li>
                <li>2. Haz clic en el enlace de verificación</li>
                <li>3. Ingresa a tu panel de administración</li>
                <li>4. ¡Comienza a crear tu tienda!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tu tienda digital en
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {' '}WhatsApp
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea tu tienda digital en minutos y compártela en WhatsApp Estados, 
            Instagram y redes sociales para llegar a más clientes.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Store className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fácil de crear</h3>
              <p className="text-gray-600 text-sm">
                Sin conocimientos técnicos. Solo completa los datos y listo.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Smartphone className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-gray-600 text-sm">
                Diseñado para verse perfecto en celulares y tablets.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Más ventas</h3>
              <p className="text-gray-600 text-sm">
                Llega a todos tus contactos con un solo link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="pb-20">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">
                Crear mi tienda gratis
              </CardTitle>
              <p className="text-gray-600">
                Completa estos datos para comenzar
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de tu tienda *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Tienda de María, Tech Store, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email para administrar *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Creando tienda...' : 'Crear mi tienda gratis'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-xs text-gray-500">
                  Al registrarte aceptas nuestros términos de servicio.
                  <br />
                  Desarrollado por @vstecnic by Juan G. Soto
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
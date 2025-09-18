'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, LogOut, Edit, Trash2, Plus } from 'lucide-react'

interface Store {
  id: string
  slug: string
  name: string
  logoUrl?: string
  contactInfo?: string
  instagramUrl?: string
  whatsappUrl?: string
}

interface Card {
  id: string
  title: string
  description: string
  image1Url?: string
  image2Url?: string
  image3Url?: string
  orderPosition: number
}

const AdminMain = () => {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [store, setStore] = useState<Store | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  // Estilos CSS en línea para garantizar aplicación
  const styles = {
    body: {
      backgroundColor: '#1e293b',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderBottom: '4px solid #60a5fa',
      marginBottom: '2rem'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem 1rem',
      textAlign: 'center' as const
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: 0
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem 2rem 1rem'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #60a5fa',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      textAlign: 'center' as const,
      marginBottom: '1.5rem'
    },
    productCard: {
      backgroundColor: '#ffffff',
      border: '2px solid #60a5fa',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    productTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      textAlign: 'center' as const,
      marginBottom: '1rem'
    },
    productImage: {
      width: '128px',
      height: '128px',
      backgroundColor: '#f3f4f6',
      border: '2px solid #60a5fa',
      borderRadius: '0.5rem',
      margin: '0 auto 1rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    productDescription: {
      color: '#1e293b',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap' as const
    },
    button: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s',
      fontSize: '0.875rem'
    },
    buttonSecondary: {
      backgroundColor: '#64748b',
      color: '#ffffff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s',
      fontSize: '0.875rem'
    },
    buttonRed: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s',
      fontSize: '0.875rem'
    },
    infoText: {
      color: '#1e293b',
      textAlign: 'center' as const,
      marginBottom: '0.5rem'
    },
    footer: {
      backgroundColor: '#1e293b',
      borderTop: '4px solid #60a5fa',
      marginTop: '2rem',
      padding: '1rem',
      textAlign: 'center' as const
    },
    footerText: {
      color: '#ffffff',
      fontSize: '0.875rem',
      margin: 0
    }
  }

  // Memoizar fetchStoreData para evitar warnings de dependencias
  const fetchStoreData = useCallback(async () => {
    try {
      const response = await fetch(`/api/cards?store=${slug}`)
      if (response.ok) {
        const data = await response.json()
        setStore(data.store)
        setCards(data.cards)
      }
    } catch (error) {
      console.error('Error fetching store data:', error)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    // Aplicar estilos al body guardando los valores originales
    const originalBackgroundColor = document.body.style.backgroundColor
    const originalMinHeight = document.body.style.minHeight
    const originalMargin = document.body.style.margin
    const originalPadding = document.body.style.padding
    const originalFontFamily = document.body.style.fontFamily

    document.body.style.backgroundColor = styles.body.backgroundColor
    document.body.style.minHeight = styles.body.minHeight
    document.body.style.margin = styles.body.margin.toString()
    document.body.style.padding = styles.body.padding.toString()
    document.body.style.fontFamily = styles.body.fontFamily

    return () => {
      // Restaurar estilos originales al desmontar
      document.body.style.backgroundColor = originalBackgroundColor
      document.body.style.minHeight = originalMinHeight
      document.body.style.margin = originalMargin
      document.body.style.padding = originalPadding
      document.body.style.fontFamily = originalFontFamily
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/${slug}/auth/signin`)
      return
    }

    fetchStoreData()
  }, [session, status, slug, router, fetchStoreData])

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta card?')) return

    try {
      const response = await fetch(`/api/cards?id=${cardId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId))
      } else {
        alert('Error al eliminar la card')
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      alert('Error al eliminar la card')
    }
  }

  if (loading) {
    return (
      <div style={styles.body}>
        <div style={styles.main}>
          <div style={styles.card}>
            <p style={styles.infoText}>Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            {store?.name || 'Panel de Administración'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        
        {/* Botones principales */}
        <div style={styles.buttonContainer}>
          <Link href={`/${slug}`} target="_blank">
            <button
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }}
            >
              <Eye size={16} />
              Ver Tienda
            </button>
          </Link>
          
          <Link href={`/${slug}/admin/new`}>
            <button
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }}
            >
              <Plus size={16} />
              Nueva Card
            </button>
          </Link>
          
          <button
            style={styles.buttonRed}
            onClick={() => signOut()}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444'
            }}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>

        {/* Productos/Cards */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Productos / Cards</h2>
          
          {cards.length === 0 ? (
            <p style={styles.infoText}>
              No hay cards creadas. Crea tu primera card para comenzar.
            </p>
          ) : (
            cards.map((card) => (
              <div key={card.id} style={styles.productCard}>
                <h3 style={styles.productTitle}>{card.title}</h3>
                
                <div style={styles.productImage}>
                  {card.image1Url ? (
                    <Image
                      src={card.image1Url}
                      alt={card.title}
                      width={128}
                      height={128}
                      style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                    />
                  ) : (
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      Sin imagen
                    </span>
                  )}
                </div>
                
                <p style={styles.productDescription}>
                  {card.description}
                </p>
                
                <div style={styles.buttonContainer}>
                  {/* Botón Ver Detalle */}
                  <Link href={`/${slug}/admin/detail/${card.id}`}>
                    <button
                      style={styles.buttonSecondary}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#475569'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#64748b'
                      }}
                    >
                      <Eye size={16} />
                      Ver Detalle
                    </button>
                  </Link>
                  
                  <Link href={`/${slug}/admin/edit/${card.id}`}>
                    <button
                      style={styles.button}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563eb'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#3b82f6'
                      }}
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                  </Link>
                  
                  <button
                    style={styles.buttonRed}
                    onClick={() => handleDeleteCard(card.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444'
                    }}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Información de la Tienda */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Información de la Tienda</h2>
          <div style={styles.infoText}>
            <p><strong>Nombre:</strong> {store?.name}</p>
            {store?.contactInfo && (
              <p><strong>Contacto:</strong> {store.contactInfo}</p>
            )}
            {store?.instagramUrl && (
              <p><strong>Instagram:</strong> {store.instagramUrl}</p>
            )}
            {store?.whatsappUrl && (
              <p><strong>WhatsApp:</strong> {store.whatsappUrl}</p>
            )}
          </div>
        </div>

        {/* Header / Footer */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Header / Footer</h2>
          <p style={styles.infoText}>
            Configuración del encabezado y pie de página
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Desarrollado por @vstecnic by Juan G. Soto
        </p>
      </footer>
    </div>
  )
}

export default AdminMain
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

interface Card {
  id: string
  title: string
  description: string
  image1Url?: string
  image2Url?: string
  image3Url?: string
  orderPosition: number
}

const AdminDetail = () => {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const cardId = params.id as string

  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  // Estilos CSS en línea consistentes
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
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    backButton: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: '600',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: 0
    },
    main: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 1rem 2rem 1rem'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #60a5fa',
      padding: '2rem',
      marginBottom: '2rem'
    },
    cardTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      textAlign: 'center' as const,
      marginBottom: '1rem'
    },
    description: {
      color: '#1e293b',
      lineHeight: '1.6',
      fontSize: '1.1rem',
      textAlign: 'center' as const,
      backgroundColor: '#f8fafc',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    },
    imagesContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap' as const
    },
    imageWrapper: {
      textAlign: 'center' as const
    },
    image: {
      width: '200px',
      height: '200px',
      borderRadius: '0.75rem',
      border: '3px solid #60a5fa',
      objectFit: 'cover' as const,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    imageLabel: {
      color: '#64748b',
      fontSize: '0.875rem',
      marginTop: '0.5rem'
    },
    noImages: {
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '1rem',
      fontStyle: 'italic',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      border: '2px dashed #cbd5e1',
      borderRadius: '0.75rem'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap' as const,
      marginTop: '2rem'
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
      transition: 'background-color 0.2s'
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
      transition: 'background-color 0.2s'
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

  // Memoizar fetchCard para evitar warnings
  const fetchCard = useCallback(async () => {
    try {
      const response = await fetch(`/api/cards?store=${slug}`)
      if (response.ok) {
        const data = await response.json()
        const foundCard = data.cards.find((c: Card) => c.id === cardId)
        setCard(foundCard || null)
      }
    } catch (error) {
      console.error('Error fetching card:', error)
    } finally {
      setLoading(false)
    }
  }, [slug, cardId])

  useEffect(() => {
    // Aplicar estilos al body
    document.body.style.backgroundColor = styles.body.backgroundColor
    document.body.style.minHeight = styles.body.minHeight
    document.body.style.margin = styles.body.margin.toString()
    document.body.style.padding = styles.body.padding.toString()
    document.body.style.fontFamily = styles.body.fontFamily

    return () => {
      // Limpiar estilos al desmontar
      document.body.style.backgroundColor = ''
      document.body.style.minHeight = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
      document.body.style.fontFamily = ''
    }
  }, []) // Sin dependencias - solo aplicar estilos una vez

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/${slug}/auth/signin`)
      return
    }

    fetchCard()
  }, [session, status, router, slug, fetchCard]) // Incluir todas las dependencias

  const handleDeleteCard = async () => {
    if (!card) return
    
    if (!confirm(`¿Estás seguro de que quieres eliminar "${card.title}"?`)) return

    try {
      const response = await fetch(`/api/cards?id=${card.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push(`/${slug}/admin`)
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
            <h2 style={styles.cardTitle}>Cargando...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div style={styles.body}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <Link
              href={`/${slug}/admin`}
              style={styles.backButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }}
            >
              <ArrowLeft size={16} />
              Volver
            </Link>
            <h1 style={styles.title}>Card no encontrada</h1>
          </div>
        </header>
        <div style={styles.main}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Card no encontrada</h2>
            <div style={styles.buttonContainer}>
              <Link href={`/${slug}/admin`} style={styles.button}>
                <ArrowLeft size={16} />
                Volver al panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const images = [
    { url: card.image1Url, label: 'Imagen 1' },
    { url: card.image2Url, label: 'Imagen 2' },
    { url: card.image3Url, label: 'Imagen 3' }
  ].filter(img => img.url)

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link
            href={`/${slug}/admin`}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            <ArrowLeft size={16} />
            Volver al Panel
          </Link>
          <h1 style={styles.title}>Detalle de Card</h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{card.title}</h2>
          
          {/* Descripción */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Descripción</h3>
            <div style={styles.description}>
              {card.description}
            </div>
          </div>

          {/* Imágenes */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Imágenes del Producto</h3>
            
            {images.length > 0 ? (
              <div style={styles.imagesContainer}>
                {images.map((image, index) => (
                  <div key={index} style={styles.imageWrapper}>
                    <Image
                      src={image.url!}
                      alt={`${card.title} - ${image.label}`}
                      width={200}
                      height={200}
                      style={styles.image}
                    />
                    <p style={styles.imageLabel}>{image.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noImages}>
                Esta card no tiene imágenes asociadas
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div style={styles.buttonContainer}>
            <Link
              href={`/${slug}/admin/edit/${card.id}`}
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }}
            >
              <Edit size={16} />
              Editar Card
            </Link>
            
            <button
              onClick={handleDeleteCard}
              style={styles.buttonRed}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444'
              }}
            >
              <Trash2 size={16} />
              Eliminar Card
            </button>
          </div>
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

export default AdminDetail
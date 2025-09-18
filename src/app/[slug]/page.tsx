'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

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

const ClientMain = () => {
  const params = useParams()
  const slug = params.slug as string

  const [store, setStore] = useState<Store | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  // Estilos CSS en línea consistentes con admin
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
      padding: '2rem 1rem',
      textAlign: 'center' as const
    },
    storeName: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: '0 0 0.5rem 0'
    },
    storeContact: {
      fontSize: '1.1rem',
      color: '#64748b',
      margin: 0
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem 2rem 1rem'
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #60a5fa',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      textAlign: 'center' as const,
      marginBottom: '1rem'
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
      flexWrap: 'wrap' as const
    },
    image: {
      width: '100px',
      height: '100px',
      borderRadius: '0.5rem',
      border: '2px solid #60a5fa',
      objectFit: 'cover' as const
    },
    noImage: {
      width: '100px',
      height: '100px',
      backgroundColor: '#f3f4f6',
      border: '2px solid #60a5fa',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '0.75rem'
    },
    description: {
      color: '#1e293b',
      textAlign: 'center' as const,
      lineHeight: '1.6',
      fontSize: '1rem'
    },
    emptyState: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #60a5fa',
      padding: '3rem 1.5rem',
      textAlign: 'center' as const
    },
    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      marginBottom: '1rem'
    },
    emptyText: {
      color: '#64748b',
      fontSize: '1.1rem'
    },
    footer: {
      backgroundColor: '#1e293b',
      borderTop: '4px solid #60a5fa',
      marginTop: '3rem',
      padding: '2rem 1rem'
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center' as const
    },
    footerTitle: {
      color: '#60a5fa',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    footerText: {
      color: '#cbd5e1',
      fontSize: '0.9rem',
      marginBottom: '0.5rem'
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1rem',
      flexWrap: 'wrap' as const
    },
    socialLink: {
      color: '#60a5fa',
      textDecoration: 'none',
      fontSize: '0.9rem',
      padding: '0.5rem 1rem',
      border: '1px solid #60a5fa',
      borderRadius: '0.5rem',
      transition: 'all 0.2s'
    },
    credits: {
      color: '#64748b',
      fontSize: '0.75rem',
      marginTop: '2rem',
      paddingTop: '1rem',
      borderTop: '1px solid #374151'
    }
  }

  // Memoizar la función fetchStoreData para evitar warning de dependencias
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
    fetchStoreData()
  }, [fetchStoreData])

  // Función para manejar click en card (sin usar el parámetro card)
  const handleCardClick = () => {
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div style={styles.body}>
        <div style={styles.main}>
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>Cargando...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div style={styles.body}>
        <div style={styles.main}>
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>Tienda no encontrada</h2>
            <p style={styles.emptyText}>
              La tienda que buscas no existe o no está disponible.
            </p>
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
          {store.logoUrl && (
            <div style={{ marginBottom: '1rem' }}>
              <Image
                src={store.logoUrl}
                alt={store.name}
                width={80}
                height={80}
                style={{ borderRadius: '50%', border: '3px solid #60a5fa' }}
              />
            </div>
          )}
          <h1 style={styles.storeName}>{store.name}</h1>
          {store.contactInfo && (
            <p style={styles.storeContact}>{store.contactInfo}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {cards.length === 0 ? (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>¡Próximamente!</h2>
            <p style={styles.emptyText}>
              Esta tienda está preparando productos increíbles para ti. 
              Vuelve pronto para ver las novedades.
            </p>
          </div>
        ) : (
          <div style={styles.cardsContainer}>
            {cards.map((card) => (
              <div
                key={card.id}
                style={styles.card}
                onClick={handleCardClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.borderColor = '#3b82f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#60a5fa'
                }}
              >
                <h2 style={styles.cardTitle}>{card.title}</h2>
                
                <div style={styles.imageContainer}>
                  {card.image1Url && (
                    <Image
                      src={card.image1Url}
                      alt={card.title}
                      width={100}
                      height={100}
                      style={styles.image}
                    />
                  )}
                  {card.image2Url && (
                    <Image
                      src={card.image2Url}
                      alt={card.title}
                      width={100}
                      height={100}
                      style={styles.image}
                    />
                  )}
                  {card.image3Url && (
                    <Image
                      src={card.image3Url}
                      alt={card.title}
                      width={100}
                      height={100}
                      style={styles.image}
                    />
                  )}
                  {!card.image1Url && !card.image2Url && !card.image3Url && (
                    <div style={styles.noImage}>
                      Sin imagen
                    </div>
                  )}
                </div>
                
                <p style={styles.description}>{card.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <h3 style={styles.footerTitle}>Contacto</h3>
          
          {store.contactInfo && (
            <p style={styles.footerText}>📞 {store.contactInfo}</p>
          )}
          
          <div style={styles.socialLinks}>
            {store.whatsappUrl && (
              <a
                href={store.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#60a5fa'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#60a5fa'
                }}
              >
                💬 WhatsApp
              </a>
            )}
            
            {store.instagramUrl && (
              <a
                href={store.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#60a5fa'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#60a5fa'
                }}
              >
                📸 Instagram
              </a>
            )}
          </div>
          
          <p style={styles.credits}>
            Desarrollado por @vstecnic by Juan G. Soto
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ClientMain
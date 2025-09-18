'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

type Product = {
  id: string
  name: string
  description: string
  images?: string[]
}

type Store = {
  name: string
  contact?: string
  products?: Product[]
  links?: { name: string; url: string }[]
}

const styles = {
  body: {
    backgroundColor: '#1e293b',
    minHeight: '100vh',
    margin: '0',
    padding: '0',
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

export default function StorePage() {
  const params = useParams()
  const [store, setStore] = useState<Store | null>(null)

  useEffect(() => {
    document.body.style.backgroundColor = styles.body.backgroundColor
    document.body.style.fontFamily = styles.body.fontFamily
    document.body.style.margin = styles.body.margin
    document.body.style.padding = styles.body.padding

    return () => {
      document.body.style.backgroundColor = ''
      document.body.style.fontFamily = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
    }
  }, [])

  const fetchStore = useCallback(async () => {
    const res = await fetch(`/api/${params.slug}/store`)
    if (res.ok) {
      const data: Store = await res.json()
      setStore(data)
    }
  }, [params.slug])

  useEffect(() => {
    fetchStore()
  }, [fetchStore])

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.storeName}>{store?.name || 'Mi Tienda'}</h1>
          {store?.contact && (
            <p style={styles.storeContact}>{store.contact}</p>
          )}
        </div>
      </header>

      <main style={styles.main}>
        {store?.products?.length ? (
          <div style={styles.cardsContainer}>
            {store.products.map((p) => (
              <div key={p.id} style={styles.card}>
                <h2 style={styles.cardTitle}>{p.name}</h2>
                <div style={styles.imageContainer}>
                  {p.images?.length ? (
                    p.images.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={p.name}
                        width={100}
                        height={100}
                        style={styles.image}
                      />
                    ))
                  ) : (
                    <div style={styles.noImage}>Sin imagen</div>
                  )}
                </div>
                <p style={styles.description}>{p.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>Sin productos</h2>
            <p style={styles.emptyText}>
              Aún no se han cargado productos en esta tienda.
            </p>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <h3 style={styles.footerTitle}>Contacto</h3>
          <p style={styles.footerText}>{store?.contact || '---'}</p>
          <div style={styles.socialLinks}>
            {store?.links?.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                {link.name}
              </a>
            ))}
          </div>
          <p style={styles.credits}>
            © {new Date().getFullYear()} {store?.name || 'Mi Tienda'}
          </p>
        </div>
      </footer>
    </>
  )
}

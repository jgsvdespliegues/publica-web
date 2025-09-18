'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, LogOut, Edit, Trash2, Plus } from 'lucide-react'

/* ---- styles movido fuera ---- */
const styles = {
  body: {
    backgroundColor: '#1e293b',
    minHeight: '100vh',
    margin: '0',       // <- cambiado a string
    padding: '0',      // <- cambiado a string
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

/* ---------------- Componente ---------------- */

export default function AdminPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])

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

  const fetchProducts = useCallback(async () => {
    const res = await fetch(`/api/${params.slug}/products`)
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
  }, [params.slug])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      await fetch(`/api/${params.slug}/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    }
  }

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Panel Administrador</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Productos</h2>

          <div style={styles.buttonContainer}>
            <Link href={`/${params.slug}/admin/new`} style={styles.button}>
              <Plus size={16} /> Nuevo
            </Link>
            <button
              onClick={() => signOut()}
              style={styles.buttonSecondary}
            >
              <LogOut size={16} /> Salir
            </button>
          </div>

          {products.length === 0 ? (
            <p style={styles.infoText}>No hay productos</p>
          ) : (
            products.map((p: any) => (
              <div key={p.id} style={styles.productCard}>
                <h3 style={styles.productTitle}>{p.name}</h3>
                <div style={styles.productImage}>
                  {p.images?.[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      width={128}
                      height={128}
                    />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                </div>
                <p style={styles.productDescription}>{p.description}</p>

                <div style={styles.buttonContainer}>
                  <Link href={`/${params.slug}/products/${p.id}`} style={styles.button}>
                    <Eye size={16} /> Ver
                  </Link>
                  <Link href={`/${params.slug}/admin/edit/${p.id}`} style={styles.button}>
                    <Edit size={16} /> Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={styles.buttonRed}
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Mi Tienda</p>
      </footer>
    </>
  )
}

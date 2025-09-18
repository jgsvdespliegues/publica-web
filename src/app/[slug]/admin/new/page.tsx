'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Upload, X } from 'lucide-react'

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
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '2px solid #60a5fa',
    padding: '2rem'
  },
  formTitle: {
    fontSize: '1.75rem',
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
  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    minHeight: '120px',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit'
  },
  imageSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  imageUpload: {
    border: '2px dashed #cbd5e1',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePreview: {
    position: 'relative' as const,
    border: '2px solid #60a5fa',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    height: '200px'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  removeButton: {
    position: 'absolute' as const,
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '2rem',
    height: '2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem'
  },
  uploadText: {
    color: '#64748b',
    fontSize: '0.875rem',
    marginTop: '0.5rem'
  },
  hiddenInput: {
    display: 'none'
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
    fontSize: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s',
    minWidth: '120px'
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  helpText: {
    color: '#64748b',
    fontSize: '0.875rem',
    textAlign: 'center' as const,
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0'
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

export default function NewProductPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/${params.slug}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, images })
      })
      if (res.ok) {
        router.push(`/${params.slug}/admin`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href={`/${params.slug}/admin`} style={styles.backButton}>
            <ArrowLeft size={16} /> Volver
          </Link>
          <h1 style={styles.title}>Nuevo Producto</h1>
        </div>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Crear Producto</h2>

          <div style={styles.section}>
            <label style={styles.label}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Imágenes</h3>
            <div style={styles.imageSection}>
              {images.map((img, idx) => (
                <div key={idx} style={styles.imagePreview}>
                  <Image src={img} alt="" fill style={styles.image} />
                  <button
                    type="button"
                    style={styles.removeButton}
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== idx))
                    }
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label style={styles.imageUpload}>
                <Upload size={24} />
                <span style={styles.uploadText}>Subir Imagen</span>
                <input
                  type="file"
                  accept="image/*"
                  style={styles.hiddenInput}
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = ev => {
                        if (ev.target?.result) {
                          setImages([...images, ev.target.result as string])
                        }
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {})
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          <p style={styles.helpText}>
            Una vez guardado, podrás ver y editar el producto desde el panel
            administrador.
          </p>
        </form>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Mi Tienda</p>
      </footer>
    </>
  )
}

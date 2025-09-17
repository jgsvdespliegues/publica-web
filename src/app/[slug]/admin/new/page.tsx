'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Upload, X } from 'lucide-react'

const AdminNew = () => {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image1Url: '',
    image2Url: '',
    image3Url: ''
  })
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
  const [saving, setSaving] = useState(false)

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
  }, [session, status, router, slug]) // Incluir todas las dependencias

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (file: File, imageKey: string) => {
    setUploading(prev => ({ ...prev, [imageKey]: true }))

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, [imageKey]: data.url }))
      } else {
        alert('Error subiendo imagen')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error subiendo imagen')
    } finally {
      setUploading(prev => ({ ...prev, [imageKey]: false }))
    }
  }

  const handleImageRemove = (imageKey: string) => {
    setFormData(prev => ({ ...prev, [imageKey]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push(`/${slug}/admin`)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Error creando card')
      }
    } catch (error) {
      console.error('Error creating card:', error)
      alert('Error creando card')
    } finally {
      setSaving(false)
    }
  }

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
          <h1 style={styles.title}>Nueva Card</h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Crear Nueva Card</h2>

          {/* Título */}
          <div style={styles.section}>
            <label htmlFor="title" style={styles.label}>
              Título de la Card *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Ej: Vinos Premium, Artesanías, etc."
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={styles.section}>
            <label htmlFor="description" style={styles.label}>
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe tu producto o servicio. Incluye detalles importantes como precios, características, etc."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
              }}
            />
          </div>

          {/* Imágenes */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Imágenes del Producto</h3>
            <div style={styles.imageSection}>
              {[1, 2, 3].map((num) => {
                const imageKey = `image${num}Url` as keyof typeof formData
                const imageUrl = formData[imageKey]
                const isUploading = uploading[imageKey]

                return (
                  <div key={num}>
                    {imageUrl ? (
                      <div style={styles.imagePreview}>
                        <Image
                          src={imageUrl}
                          alt={`Imagen ${num}`}
                          width={200}
                          height={200}
                          style={styles.image}
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(imageKey)}
                          style={styles.removeButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          ...styles.imageUpload,
                          borderColor: isUploading ? '#3b82f6' : '#cbd5e1',
                          backgroundColor: isUploading ? '#f0f9ff' : '#ffffff'
                        }}
                        onClick={() => {
                          if (!isUploading) {
                            document.getElementById(`file-${num}`)?.click()
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (!isUploading) {
                            e.currentTarget.style.borderColor = '#3b82f6'
                            e.currentTarget.style.backgroundColor = '#f8fafc'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isUploading) {
                            e.currentTarget.style.borderColor = '#cbd5e1'
                            e.currentTarget.style.backgroundColor = '#ffffff'
                          }
                        }}
                      >
                        <Upload size={24} color={isUploading ? '#3b82f6' : '#64748b'} />
                        <p style={styles.uploadText}>
                          {isUploading ? 'Subiendo...' : `Subir Imagen ${num}`}
                        </p>
                        <input
                          id={`file-${num}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(file, imageKey)
                            }
                          }}
                          style={styles.hiddenInput}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div style={styles.helpText}>
              Tip: Puedes subir hasta 3 imágenes. Las imágenes ayudan a que tus clientes vean mejor tus productos. Formatos: JPG, PNG, WEBP.
            </div>
          </div>

          {/* Botones */}
          <div style={styles.buttonContainer}>
            <button
              type="submit"
              disabled={saving || !formData.title || !formData.description}
              style={{
                ...styles.button,
                ...((saving || !formData.title || !formData.description) ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!saving && formData.title && formData.description) {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving && formData.title && formData.description) {
                  e.currentTarget.style.backgroundColor = '#3b82f6'
                }
              }}
            >
              {saving ? 'Creando...' : 'Crear Card'}
            </button>
          </div>
        </form>
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

export default AdminNew
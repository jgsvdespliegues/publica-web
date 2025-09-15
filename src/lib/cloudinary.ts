import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
}

// Subir imagen desde base64 string
export async function uploadToCloudinary(
  fileData: string, // base64 string
  folder: string = 'publica-web'
): Promise<CloudinaryUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Error al subir imagen')
  }
}

// Eliminar imagen de Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return false
  }
}

// Obtener URL de imagen optimizada
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string
  } = {}
): string {
  const { width = 400, height = 300, quality = 'auto' } = options
  
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality }
    ]
  })
}

export default cloudinary
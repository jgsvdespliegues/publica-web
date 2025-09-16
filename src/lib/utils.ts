import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generar slug único para tiendas
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números y espacios
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-") // Múltiples guiones a uno
}

// Verificar si un slug está disponible
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existingStore = await prisma.store.findUnique({
    where: { slug }
  })
  return !existingStore
}

// Generar slug único añadiendo números si es necesario
export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name) // Cambiado de 'let' a 'const'
  let slug = baseSlug
  let counter = 1
  
  while (!(await isSlugAvailable(slug))) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verificar contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generar token de verificación
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar contraseña (mínimo 6 caracteres)
export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

// Formatear fecha
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
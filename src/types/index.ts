import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      storeId: string
      storeSlug: string
      storeName: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    storeId: string
    storeSlug: string
    storeName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    storeId: string
    storeSlug: string
    storeName: string
  }
}

// Tipos para las entidades del sistema
export interface Store {
  id: string
  slug: string
  name: string
  logoUrl?: string
  contactInfo?: string
  instagramUrl?: string
  whatsappUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Card {
  id: string
  storeId: string
  title: string
  description: string
  image1Url?: string
  image2Url?: string
  image3Url?: string
  orderPosition: number
  createdAt: Date
  updatedAt: Date
}

export interface StoreAuth {
  id: string
  storeId: string
  email: string
  passwordHash: string
  isVerified: boolean
  verificationToken?: string
  createdAt: Date
  updatedAt: Date
}
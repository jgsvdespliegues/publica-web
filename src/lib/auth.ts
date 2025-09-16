import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { DefaultSession, DefaultUser } from "next-auth"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

// Extender los tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      storeId: string;
      storeSlug: string;
      storeName: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    storeId: string;
    storeSlug: string;
    storeName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    storeId: string;
    storeSlug: string;
    storeName: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        storeSlug: { label: "Store Slug", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.storeSlug) {
          return null
        }
        try {
          // Buscar la tienda por slug
          const store = await prisma.store.findUnique({
            where: { slug: credentials.storeSlug },
            include: { auth: true }
          })
          if (!store || !store.auth) {
            return null
          }
          // Verificar que el email coincida
          if (store.auth.email !== credentials.email) {
            return null
          }
          // Verificar que la cuenta esté verificada
          if (!store.auth.isVerified) {
            throw new Error("Cuenta no verificada. Revisa tu email.")
          }
          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            store.auth.passwordHash
          )
          if (!isPasswordValid) {
            return null
          }
          return {
            id: store.auth.id,
            email: store.auth.email,
            name: store.name,
            storeId: store.id,
            storeSlug: store.slug,
            storeName: store.name
          }
        } catch (error) {
          console.error("Error en autenticación:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.storeId = user.storeId
        token.storeSlug = user.storeSlug
        token.storeName = user.storeName
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.storeId = token.storeId;
        session.user.storeSlug = token.storeSlug;
        session.user.storeName = token.storeName;
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET
}
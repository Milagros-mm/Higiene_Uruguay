import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/backend/db/prisma"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = String(credentials.email).toLowerCase().trim()
        const password = String(credentials.password)

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (!passwordsMatch) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
          }
        } catch (error) {
          console.error("Error en authorize de NextAuth:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role || "CUSTOMER"
        token.phone = (user as { phone?: string | null }).phone || null
      }
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name
        token.phone = session.phone ?? token.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || session.user.id
        ;(session.user as unknown as { role?: string }).role = token.role as string
        ;(session.user as unknown as { phone?: string | null }).phone = token.phone as string | null
      }
      return session
    },
  },
})

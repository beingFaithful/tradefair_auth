import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import User from "@/models/User"
import connectDb from "./db"
import { verifyPassword } from "@/lib/auth"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        try {
          await connectDb()
          const user = await User.findOne({ email: credentials.email })
          
          if (!user || !user.password) {
            return null
          }

          const isValid = await verifyPassword(credentials.password as string, user.password)
          
          if (!isValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: JSON.parse(JSON.stringify(user.role)),
          }
        } catch (error) {
          console.error("Auth Error in authorize:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      // If signing in with OAuth (Google), create a user if they don't exist
      if (account?.provider === "google") {
        await connectDb()
        const existingUser = await User.findOne({ email: user.email })
        if (!existingUser) {
          await User.create({
            email: user.email,
            identifierType: 'student_email',
          })
        }
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      // Always refresh role from DB to catch role changes and handle Google OAuth users
      if (token.id || token.email) {
        await connectDb()
        const dbUser = await User.findOne(
          token.id ? { _id: token.id } : { email: token.email }
        )
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.role = JSON.parse(JSON.stringify(dbUser.role))
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    }
  }
})
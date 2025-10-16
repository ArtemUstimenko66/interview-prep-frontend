import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from './prisma';
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                const user = await prisma.user.findUnique({
                    where : { email: credentials.email }
                })

                if(!user || !user.password) {
                    throw new Error("Invalid credentials")
                }

                if(!user.emailVerified) {
                    throw new Error('Please verify your email')
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if(!isPasswordValid) {
                    throw new Error("Invalid credentials")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image
                }
            }
        }),
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile}) {
            if(account?.provider === 'google') {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                })

                if(existingUser && !existingUser.emailVerified) {
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { emailVerified: new Date() }
                    })
                }
                return true
            }
            return true
        },
        async jwt({ token, user}) {
            if(user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token}) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
}
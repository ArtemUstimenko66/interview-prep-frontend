import { prisma } from "@/lib/prisma";
import crypto from 'crypto'

export const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
}

export const createVerificationToken = async (email: string) => {
     const token = generateVerificationToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.deleteMany({
        where: { identifier: email }
    })

    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires
        }
    })
    return token;
}

export const verifyEmailToken = async (token: string) => {
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token }
    })

    if(!verificationToken) {
        return { success: false, message: 'Invalid or expired token' }
    }

    if(verificationToken.expires < new Date()) {
        await prisma.verificationToken.delete({
            where: { token }
        })
        return { success: false, message: 'Token has expired' }
    }

    const user = await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() }
    })

    await prisma.verificationToken.delete({
        where: { token }
    })
    return { success: true, email: user.email }
}

export const isEmailVerified = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { emailVerified: true }
    })
    return !!user?.emailVerified
}
import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/tokens";
import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Токен не предоставлен' },
                { status: 400 }
            );
        }

        const result = await verifyEmailToken(token);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: result.email! },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Пользователь не найден' },
                { status: 404 }
            );
        }

        const sessionToken = await encode({
            token: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            secret: process.env.NEXTAUTH_SECRET!,
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        const cookieStore = await cookies();
        cookieStore.set('next-auth.session-token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Email подтвержден!'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify and login error:', error);

        return NextResponse.json(
            { error: 'Ошибка при верификации' },
            { status: 500 }
        );
    }
}
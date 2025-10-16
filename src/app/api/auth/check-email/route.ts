import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if(!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, emailVerified: true }
        });

        if(!user) {
            return NextResponse.json(
                { exists: false, message: 'User not found' },
                { status: 404 }
            )
        }

        if(!user.emailVerified) {
            return NextResponse.json(
                { exists: true, verified: false, message: 'Email not verified' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { exists: true, verified: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Check email error:', error);
        return NextResponse.json(
            { error: 'Error while checking email' },
            { status: 500 }
        );
    }
}
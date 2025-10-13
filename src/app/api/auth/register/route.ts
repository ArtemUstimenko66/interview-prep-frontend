import { registerSchema } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validated = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email }
        });

        if(existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);

        const user = await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                password: hashedPassword,
                emailVerified: null,
            }
        })

        const token = await createVerificationToken(user.email!);

        await sendVerificationEmail({
            email: user.email!,
            token,
            name: user.name || undefined,
        })

        return NextResponse.json(
            {
                message: 'User registered successfully, please check your email to verify your account',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            { status: 201}
        )
    } catch (error) {
        console.error('Registration error:', error);

        if(error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }
}
import { registerSchema } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


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
                password: hashedPassword
            }
        })

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            { status: 201}
        )
    } catch (error) {
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
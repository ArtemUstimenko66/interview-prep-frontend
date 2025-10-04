import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Incorrect email'),
    password: z.string().min(6, 'Minimum 6 characters'),
})

export const registerSchema = z.object({
    email: z.string().email('Incorrect email'),
    password: z.string().min(6, 'Minimum 6 characters'),
    name: z.string().min(2, 'Minimum 2 characters').optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>


export { default } from 'next-auth/middleware'

export const config = {
    matcher: [
        '/dashboard/:path*',
        // '/interviews/:path*',
        // '/questions/:path*',
        // '/progress/:path*',
    ]
}
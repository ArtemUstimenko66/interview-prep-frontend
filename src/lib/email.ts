import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // true для 465, false для других портов
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

// check the connection configuration is correct
transporter.verify((error, success) => {
    if (error) {
        console.error('Email server connection error:', error)
    } else {
        console.log('Email server is ready')
    }
})

interface SendVerificationEmailParams {
    email: string;
    token: string;
    name?: string;
}

export const sendVerificationEmail = async ({
                                                email,
                                                token,
                                                name,
                                            }: SendVerificationEmailParams) => {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Подтвердите ваш email',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #0070f3;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Подтверждение email</h2>
                    ${name ? `<p>Привет, ${name}!</p>` : '<p>Привет!</p>'}
                    <p>Спасибо за регистрацию! Пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:</p>
                    
                    <a href="${verificationUrl}" class="button">Подтвердить Email</a>
                    
                    <p>Или скопируйте и вставьте эту ссылку в браузер:</p>
                    <p style="word-break: break-all; color: #0070f3;">${verificationUrl}</p>
                    
                    <div class="footer">
                        <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
                        <p>Ссылка действительна в течение 24 часов.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Подтверждение email
            
            ${name ? `Привет, ${name}!` : 'Привет!'}
            
            Спасибо за регистрацию! Пожалуйста, подтвердите ваш email адрес, перейдя по ссылке:
            
            ${verificationUrl}
            
            Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
            Ссылка действительна в течение 24 часов.
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Verification email sent to:', email)
    } catch (error) {
        console.error('Error sending verification email:', error)
        throw new Error('Failed to send verification email')
    }
}
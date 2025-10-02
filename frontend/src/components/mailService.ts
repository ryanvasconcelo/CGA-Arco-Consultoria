import nodemailer from 'nodemailer';
interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

async function getTransporter() {
    // Para desenvolvimento, usamos uma conta de teste do Ethereal.
    // Isso evita spam e não requer credenciais reais.
    if (process.env.NODE_ENV === 'development') {
        const testAccount = await nodemailer.createTestAccount();
        console.log('Conta de teste Ethereal criada:', testAccount.user);
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    // TODO: Configurar para produção (ex: SendGrid, AWS SES, etc.)
    // Exemplo para um SMTP genérico:
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export async function sendMail({ to, subject, html }: MailOptions) {
    try {
        const transporter = await getTransporter();

        const info = await transporter.sendMail({
            from: '"Arco CGA" <nao-responda@arco.com>', // Endereço do remetente
            to,
            subject,
            html,
        });

        console.log('Mensagem enviada: %s', info.messageId);
        // Link para visualizar o e-mail no Ethereal
        console.log('URL de pré-visualização: %s', nodemailer.getTestAccountMessageUrl(info));
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}
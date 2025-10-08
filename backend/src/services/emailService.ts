import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'CGA Sistema'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado com sucesso para: ${options.to}`);
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email');
    }
  }

  async sendTemporaryPassword(email: string, name: string, temporaryPassword: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .password-box { background: white; border: 2px solid #667eea; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center; }
          .password { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Bem-vindo ao CGA!</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${name}</strong>,</p>
            <p>Sua conta foi criada com sucesso no sistema CGA. Abaixo está sua senha temporária para o primeiro acesso:</p>
            
            <div class="password-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Sua senha temporária:</p>
              <p class="password">${temporaryPassword}</p>
            </div>

            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul style="margin: 10px 0;">
                <li>Esta é uma senha temporária</li>
                <li>Você será solicitado a criar uma nova senha no primeiro login</li>
                <li>Não compartilhe esta senha com ninguém</li>
                <li>Este email é válido apenas para o primeiro acesso</li>
              </ul>
            </div>

            <p>Para acessar o sistema, visite: <a href="${process.env.FRONTEND_URL || 'https://cga.pktech.ai:5173'}/login">${process.env.FRONTEND_URL || 'https://cga.pktech.ai:5173'}/login</a></p>
            
            <p>Se você não solicitou esta conta, por favor ignore este email.</p>
            
            <p>Atenciosamente,<br><strong>Equipe CGA</strong></p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© ${new Date().getFullYear()} CGA - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá ${name},

      Sua conta foi criada no sistema CGA.
      Senha temporária: ${temporaryPassword}

      IMPORTANTE:
      - Esta é uma senha temporária
      - Você precisará criar uma nova senha no primeiro login
      - Não compartilhe esta senha

      Acesse: ${process.env.FRONTEND_URL || 'https://cga.pktech.ai:5173'}/login

      Equipe CGA
    `;

    await this.sendEmail({
      to: email,
      subject: '🔐 Sua senha temporária - CGA Sistema',
      html,
      text,
    });
  }

  async sendPasswordResetLink(email: string, name: string, resetToken: string): Promise<void> {
    const resetURL = `${process.env.FRONTEND_URL || 'https://cga.pktech.ai:5173'}/reset-password/${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #764ba2; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Redefinição de Senha</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${name}</strong>,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no sistema CGA.</p>
            
            <p style="text-align: center;">
              <a href="${resetURL}" class="button">Redefinir Minha Senha</a>
            </p>

            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul style="margin: 10px 0;">
                <li>Este link expira em 1 hora</li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Sua senha atual permanecerá ativa até que você crie uma nova</li>
              </ul>
            </div>

            <p style="font-size: 12px; color: #666;">Se o botão não funcionar, copie e cole este link no navegador:<br>
            <a href="${resetURL}">${resetURL}</a></p>
            
            <p>Atenciosamente,<br><strong>Equipe CGA</strong></p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© ${new Date().getFullYear()} CGA - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Olá ${name},

      Recebemos uma solicitação para redefinir sua senha.
      
      Clique no link abaixo para criar uma nova senha:
      ${resetURL}

      Este link expira em 1 hora.

      Se você não solicitou esta redefinição, ignore este email.

      Equipe CGA
    `;

    await this.sendEmail({
      to: email,
      subject: '🔑 Redefinição de senha - CGA Sistema',
      html,
      text,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor SMTP pronto para enviar emails');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar ao servidor SMTP:', error);
      return false;
    }
  }
}

export default new EmailService();
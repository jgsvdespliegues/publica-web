import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Enviar email de verificación
export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  storeSlug: string
): Promise<boolean> {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}&email=${email}&store=${storeSlug}`
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: 'Verifica tu cuenta - Pública',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">¡Bienvenido a Pública!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Tu tienda digital está casi lista</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Verifica tu cuenta</h2>
            <p>Hola,</p>
            <p>Gracias por crear tu tienda digital. Para comenzar a usar tu espacio publicitario, necesitas verificar tu cuenta.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        display: inline-block;">
                Verificar Cuenta
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Si no puedes hacer clic en el botón, copia y pega este enlace:
            </p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px;">
              ${verificationUrl}
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                Desarrollado por @vstecnic by Juan G. Soto
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return !!result.data
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

// Enviar email de bienvenida
export async function sendWelcomeEmail(
  email: string,
  storeName: string,
  storeSlug: string
): Promise<boolean> {
  try {
    const storeUrl = `${process.env.NEXTAUTH_URL}/${storeSlug}`
    const adminUrl = `${process.env.NEXTAUTH_URL}/${storeSlug}/admin`
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: `¡${storeName}, tu tienda está lista!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">¡Cuenta Verificada! 🎉</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2>¡Hola ${storeName}!</h2>
            <p>Tu cuenta ha sido verificada exitosamente. Ya puedes comenzar a usar tu tienda digital.</p>
            
            <h3>Tus enlaces importantes:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p><strong>Tienda pública:</strong><br>
              <a href="${storeUrl}" style="color: #667eea;">${storeUrl}</a></p>
              
              <p><strong>Panel de administración:</strong><br>
              <a href="${adminUrl}" style="color: #667eea;">${adminUrl}</a></p>
            </div>
            
            <p>Comparte tu enlace público en WhatsApp y redes sociales.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${adminUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        display: inline-block;">
                Ir a mi Panel
              </a>
            </div>
          </div>
        </div>
      `,
    })

    return !!result.data
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
}

export default resend
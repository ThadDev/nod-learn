import { Resend } from "resend"

const resendKey = process.env.RESEND_API_KEY
const isValidKey = resendKey && resendKey !== "re_123456789" && resendKey.startsWith("re_")
const resend = isValidKey ? new Resend(resendKey) : null

const FROM = "Nodlearn <no-reply@nodlearn.com>"

export class EmailService {
  static async sendWelcomeEmail(to: string, name: string) {
    if (!resend) {
      console.warn("Skipping welcome email: No valid RESEND_API_KEY")
      return null
    }
    return resend.emails.send({
      from: FROM,
      to,
      subject: "Welcome to Nodlearn! 🎉",
      html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1e40af; margin-bottom: 8px;">Welcome to Nodlearn, ${name}!</h1>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          You've just enrolled in the most accessible financial education platform on the internet. 
          We're excited to have you here.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your free course — <strong>Financial Literacy Fundamentals</strong> — is ready to start. 
          It covers:
        </p>
        <ul style="color: #374151; font-size: 16px; line-height: 2;">
          <li>📈 Stock Market Basics</li>
          <li>⛓️ Blockchain & Cryptocurrency</li>
          <li>🏠 Real Estate Investing</li>
          <li>📊 Portfolio Building & Risk Management</li>
        </ul>
        <div style="margin: 32px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Start Learning Now →
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 13px;">
          You're receiving this because you created an account on Nodlearn.<br/>
          <a href="${process.env.NEXTAUTH_URL}/privacy" style="color: #9ca3af;">Privacy Policy</a>
        </p>
      </div>
    `,
    })
  }

  static async sendCompletionEmail(to: string, name: string, certificateId: string) {
    if (!resend) {
      console.warn("Skipping completion email: No valid RESEND_API_KEY")
      return null
    }
    return resend.emails.send({
      from: FROM,
      to,
      subject: "🏆 You've completed the Nodlearn course!",
      html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #d97706; margin-bottom: 8px;">Congratulations, ${name}! 🎉</h1>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          You've completed <strong>Financial Literacy Fundamentals</strong>. 
          Your certificate is ready to download and share.
        </p>
        <div style="margin: 32px 0; text-align: center; padding: 32px; background: #fef3c7; border-radius: 12px;">
          <div style="font-size: 64px; margin-bottom: 12px;">🏆</div>
          <div style="font-size: 16px; color: #92400e; font-weight: 600;">Certificate of Completion</div>
          <div style="font-size: 22px; font-weight: 700; color: #78350f; margin-top: 8px;">${name}</div>
        </div>
        <div style="margin: 24px 0;">
          <a href="${process.env.NEXTAUTH_URL}/certificate/${certificateId}" 
             style="background: #d97706; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            View & Download Certificate →
          </a>
        </div>
      </div>
    `,
    })
  }

  static async sendAdminNewUserEmail(userName: string, userEmail: string) {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || !resend) {
      if (!resend) console.warn("Skipping admin notification: No valid RESEND_API_KEY")
      return
    }

    return resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `New user registered: ${userName}`,
      html: `
      <div style="font-family: Inter, sans-serif; padding: 24px;">
        <h2>New User Registration</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><a href="${process.env.NEXTAUTH_URL}/admin">View in Admin Dashboard →</a></p>
      </div>
    `,
    })
  }
}

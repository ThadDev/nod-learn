import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

export class PDFGeneratorService {
  /**
   * Generates a PDF certificate using Puppeteer from a given URL or HTML
   * Returns the local path to the generated PDF
   */
  static async generateCertificatePDF(certificateId: string, previewUrl: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      
      // Navigate to the preview page which we will build
      // In production, this would be the actual public URL
      // For local generation, we'll need to make sure the server is accessible or use file://
      await page.goto(previewUrl, { waitUntil: 'networkidle0' })

      // Define the output path
      const publicDir = path.join(process.cwd(), 'public', 'certificates')
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }

      const filePath = path.join(publicDir, `${certificateId}.pdf`)
      
      // Generate PDF
      await page.pdf({
        path: filePath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
      })

      return `/certificates/${certificateId}.pdf`
    } finally {
      await browser.close()
    }
  }
}

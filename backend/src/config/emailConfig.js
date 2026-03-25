// src/config/emailConfig.js
const nodemailer = require('nodemailer')
const env = require('./environment')

let transporter = null

const getTransporter = () => {
  if (transporter) return transporter

  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not set — emails will be logged to console only')
    // Return a mock transporter for development
    transporter = {
      sendMail: async (options) => {
        console.log('📧 [DEV EMAIL]', {
          to: options.to,
          subject: options.subject,
          text: options.text?.substring(0, 100) + '...',
        })
        return { messageId: 'dev-' + Date.now() }
      },
    }
    return transporter
  }

  transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_PORT === 465,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  })

  // Verify connection
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Email transporter error:', error.message)
    } else {
      console.log('✅ Email transporter ready')
    }
  })

  return transporter
}

module.exports = { getTransporter }
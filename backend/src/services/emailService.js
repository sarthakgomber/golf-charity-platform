// src/services/emailService.js
const { getTransporter } = require('../config/emailConfig')
const env = require('../config/environment')
const {
  welcomeTemplate,
  subscriptionConfirmedTemplate,
  drawResultsTemplate,
  winnerNotificationTemplate,
  payoutProcessedTemplate,
} = require('../utils/notificationUtils')

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = getTransporter()
    const info = await transporter.sendMail({
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error.message)
    return { success: false, error: error.message }
  }
}

const sendWelcomeEmail = (user) =>
  sendEmail({ to: user.email, ...welcomeTemplate({ name: user.name }) })

const sendSubscriptionConfirmed = (user, planType, amount, renewalDate) =>
  sendEmail({
    to: user.email,
    ...subscriptionConfirmedTemplate({ name: user.name, planType, amount, renewalDate }),
  })

const sendDrawResults = (user, winningNumbers, month, year) =>
  sendEmail({
    to: user.email,
    ...drawResultsTemplate({ name: user.name, winningNumbers, month, year }),
  })

const sendWinnerNotification = (user, matchType, prizeAmount, drawMonth) =>
  sendEmail({
    to: user.email,
    ...winnerNotificationTemplate({ name: user.name, matchType, prizeAmount, drawMonth }),
  })

const sendPayoutProcessed = (user, prizeAmount) =>
  sendEmail({
    to: user.email,
    ...payoutProcessedTemplate({ name: user.name, prizeAmount }),
  })

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendSubscriptionConfirmed,
  sendDrawResults,
  sendWinnerNotification,
  sendPayoutProcessed,
}
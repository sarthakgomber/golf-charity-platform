// src/utils/notificationUtils.js
const env = require('../config/environment')

const baseStyle = `
  font-family: 'DM Sans', Arial, sans-serif;
  background: #0A0A0B;
  color: #F0ECE3;
  padding: 40px 20px;
`

const cardStyle = `
  max-width: 560px;
  margin: 0 auto;
  background: #16161A;
  border: 1px solid rgba(201,168,76,0.2);
  border-radius: 12px;
  padding: 40px;
`

const goldText = `color: #C9A84C; font-size: 1.4rem; font-weight: 700;`

/**
 * Welcome email after registration
 */
const welcomeTemplate = ({ name }) => ({
  subject: 'Welcome to Par & Purpose 🏌️',
  html: `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <h1 style="color: #C9A84C; margin-bottom: 8px;">Par & Purpose</h1>
        <p style="color: #9B9488; margin-bottom: 24px;">Where every round changes a life</p>
        <h2 style="color: #F0ECE3;">Welcome, ${name}!</h2>
        <p style="color: #9B9488; line-height: 1.7;">
          Your account has been created. Subscribe to a plan to start entering scores, 
          participate in monthly draws, and support your chosen charity.
        </p>
        <a href="${env.FRONTEND_URL}/dashboard" 
           style="display:inline-block; background: #C9A84C; color: #0A0A0B; 
                  padding: 12px 28px; border-radius: 6px; text-decoration: none; 
                  font-weight: 600; margin-top: 24px;">
          Go to Dashboard
        </a>
      </div>
    </div>
  `,
  text: `Welcome to Par & Purpose, ${name}! Visit ${env.FRONTEND_URL}/dashboard to get started.`,
})

/**
 * Subscription confirmation
 */
const subscriptionConfirmedTemplate = ({ name, planType, amount, renewalDate }) => ({
  subject: 'Subscription Confirmed — Par & Purpose',
  html: `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <h1 style="color: #C9A84C;">Subscription Confirmed</h1>
        <p style="color: #9B9488;">Hi ${name},</p>
        <p style="color: #F0ECE3;">Your <strong style="color: #C9A84C;">${planType}</strong> subscription is now active.</p>
        <div style="background: #1E1E24; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #9B9488;">Amount charged</p>
          <p style="${goldText}">£${(amount / 100).toFixed(2)}</p>
          <p style="margin: 8px 0 0; color: #9B9488; font-size: 0.85rem;">
            Next renewal: ${new Date(renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <p style="color: #9B9488; font-size: 0.875rem;">
          You can now enter scores and participate in monthly draws.
        </p>
        <a href="${env.FRONTEND_URL}/dashboard" 
           style="display:inline-block; background: #C9A84C; color: #0A0A0B; 
                  padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Enter Your Scores
        </a>
      </div>
    </div>
  `,
  text: `Subscription confirmed. Plan: ${planType}. Amount: £${(amount / 100).toFixed(2)}. Renews: ${renewalDate}`,
})

/**
 * Draw results notification
 */
const drawResultsTemplate = ({ name, winningNumbers, month, year }) => ({
  subject: `Draw Results — ${month} ${year} | Par & Purpose`,
  html: `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <h1 style="color: #C9A84C;">This Month's Draw</h1>
        <p style="color: #9B9488;">Hi ${name}, here are the winning numbers for ${month} ${year}:</p>
        <div style="display: flex; gap: 10px; margin: 24px 0; flex-wrap: wrap;">
          ${winningNumbers.map(n => `
            <div style="width: 48px; height: 48px; border-radius: 50%; 
                        background: rgba(201,168,76,0.1); border: 2px solid #C9A84C;
                        display: inline-flex; align-items: center; justify-content: center;
                        font-weight: 700; color: #C9A84C; font-size: 1.1rem; text-align: center;
                        line-height: 48px; margin: 4px;">
              ${n}
            </div>
          `).join('')}
        </div>
        <a href="${env.FRONTEND_URL}/draws" 
           style="display:inline-block; background: #C9A84C; color: #0A0A0B; 
                  padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          See Full Results
        </a>
      </div>
    </div>
  `,
  text: `Draw results for ${month} ${year}: ${winningNumbers.join(', ')}. Visit ${env.FRONTEND_URL}/draws`,
})

/**
 * Winner notification
 */
const winnerNotificationTemplate = ({ name, matchType, prizeAmount, drawMonth }) => ({
  subject: `🏆 You Won! — Par & Purpose Draw`,
  html: `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <h1 style="color: #C9A84C;">Congratulations!</h1>
        <p style="color: #F0ECE3; font-size: 1.1rem;">Hi ${name}, you've won the <strong style="color: #C9A84C;">${matchType}</strong> prize!</p>
        <div style="background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.25); 
                    border-radius: 10px; padding: 24px; margin: 20px 0; text-align: center;">
          <p style="color: #9B9488; margin: 0 0 8px;">Your prize</p>
          <p style="color: #C9A84C; font-size: 2rem; font-weight: 700; margin: 0;">
            £${prizeAmount.toFixed(2)}
          </p>
          <p style="color: #5A5650; font-size: 0.8rem; margin: 8px 0 0;">${drawMonth} Draw</p>
        </div>
        <p style="color: #9B9488; line-height: 1.7;">
          To claim your prize, please upload proof of your golf scores from your golf platform.
          An admin will verify and process your payout.
        </p>
        <a href="${env.FRONTEND_URL}/dashboard" 
           style="display:inline-block; background: #C9A84C; color: #0A0A0B; 
                  padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 8px;">
          Submit Proof of Scores
        </a>
      </div>
    </div>
  `,
  text: `Congratulations ${name}! You won £${prizeAmount.toFixed(2)} in the ${drawMonth} draw. Log in to submit proof.`,
})

/**
 * Payout processed notification
 */
const payoutProcessedTemplate = ({ name, prizeAmount }) => ({
  subject: 'Your Prize Payout Has Been Processed — Par & Purpose',
  html: `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <h1 style="color: #C9A84C;">Payout Processed</h1>
        <p style="color: #F0ECE3;">Hi ${name},</p>
        <p style="color: #9B9488; line-height: 1.7;">
          Your prize of <strong style="color: #C9A84C;">£${prizeAmount.toFixed(2)}</strong> has been 
          verified and processed. Please allow 3–5 business days for funds to arrive.
        </p>
      </div>
    </div>
  `,
  text: `Hi ${name}, your prize of £${prizeAmount.toFixed(2)} has been processed.`,
})

module.exports = {
  welcomeTemplate,
  subscriptionConfirmedTemplate,
  drawResultsTemplate,
  winnerNotificationTemplate,
  payoutProcessedTemplate,
}
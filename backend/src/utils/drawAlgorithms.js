// src/utils/drawAlgorithms.js

/**
 * Generate 5 unique random numbers between 1-45 (standard lottery style)
 */
const randomDraw = () => {
  const nums = new Set()
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(nums).sort((a, b) => a - b)
}

/**
 * Algorithmic draw: weighted by LEAST frequent user scores
 * Less common scores = higher chance of being drawn = fairer distribution
 * @param {number[]} allUserScores - flat array of all users' score values
 */
const algorithmicDraw = (allUserScores = []) => {
  if (allUserScores.length === 0) return randomDraw()

  // Build frequency map
  const freq = {}
  for (let i = 1; i <= 45; i++) freq[i] = 0
  allUserScores.forEach((s) => {
    if (s >= 1 && s <= 45) freq[s] = (freq[s] || 0) + 1
  })

  // Max frequency for inversion
  const maxFreq = Math.max(...Object.values(freq))

  // Build weighted pool: lower frequency = more entries in pool
  const pool = []
  for (let n = 1; n <= 45; n++) {
    const weight = maxFreq - freq[n] + 1 // invert so rare = heavier
    for (let i = 0; i < weight; i++) pool.push(n)
  }

  // Pick 5 unique from weighted pool
  const nums = new Set()
  let attempts = 0
  while (nums.size < 5 && attempts < 1000) {
    const pick = pool[Math.floor(Math.random() * pool.length)]
    nums.add(pick)
    attempts++
  }

  // Fallback to random if something goes wrong
  if (nums.size < 5) return randomDraw()

  return Array.from(nums).sort((a, b) => a - b)
}

/**
 * Check how many numbers a user's scores match against winning numbers
 * @param {number[]} userScores - user's last 5 scores (values only)
 * @param {number[]} winningNumbers - 5 winning numbers
 * @returns {number} count of matches (0-5)
 */
const checkMatches = (userScores, winningNumbers) => {
  const winSet = new Set(winningNumbers)
  return userScores.filter((s) => winSet.has(s)).length
}

/**
 * Classify match count into prize tier
 * @returns {'5-number-match'|'4-number-match'|'3-number-match'|null}
 */
const getMatchTier = (matchCount) => {
  if (matchCount === 5) return '5-number-match'
  if (matchCount === 4) return '4-number-match'
  if (matchCount === 3) return '3-number-match'
  return null
}

module.exports = {
  randomDraw,
  algorithmicDraw,
  checkMatches,
  getMatchTier,
}
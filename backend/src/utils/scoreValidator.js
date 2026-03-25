// src/utils/scoreValidator.js

const MIN_SCORE = 1
const MAX_SCORE = 45
const MAX_SCORES = 5

/**
 * Validate a single Stableford score value
 */
const isValidScore = (value) => {
  const num = parseInt(value)
  return !isNaN(num) && num >= MIN_SCORE && num <= MAX_SCORE
}

/**
 * Validate a score date — must not be in the future
 */
const isValidScoreDate = (date) => {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d) && d <= new Date()
}

/**
 * Validate a full score object { value, date }
 * Returns { valid: bool, error: string|null }
 */
const validateScoreEntry = (entry) => {
  if (!entry || typeof entry !== 'object') {
    return { valid: false, error: 'Invalid score entry' }
  }
  if (!isValidScore(entry.value)) {
    return { valid: false, error: `Score must be between ${MIN_SCORE} and ${MAX_SCORE}` }
  }
  if (!entry.date) {
    return { valid: false, error: 'Score date is required' }
  }
  if (!isValidScoreDate(entry.date)) {
    return { valid: false, error: 'Score date cannot be in the future' }
  }
  return { valid: true, error: null }
}

/**
 * Apply rolling 5-score logic:
 * Merge new scores into existing, sort by date descending, keep latest 5
 */
const applyRollingScores = (existingScores = [], newScores = []) => {
  const merged = [...existingScores, ...newScores]
  merged.sort((a, b) => new Date(b.date) - new Date(a.date))
  return merged.slice(0, MAX_SCORES)
}

/**
 * Extract just the numeric values from score objects
 */
const extractScoreValues = (scores = []) => scores.map((s) => s.value)

module.exports = {
  MIN_SCORE,
  MAX_SCORE,
  MAX_SCORES,
  isValidScore,
  isValidScoreDate,
  validateScoreEntry,
  applyRollingScores,
  extractScoreValues,
}
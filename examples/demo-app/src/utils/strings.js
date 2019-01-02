/**
 * Generate a hash string based on number of character
 * @param {number} count
 * @returns {string} hash string
 */
export function generateHashId(count) {
  return Math.random()
    .toString(36)
    .substr(count);
}

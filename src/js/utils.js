/**
 * @param {number} start
 * @param {number} end
 * @param {number} t
 * @returns {number}
 */
export const lerp = (start, end, t) => start + ((end - start) * t) // prettier-ignore

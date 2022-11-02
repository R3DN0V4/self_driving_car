/** @typedef (import('./types').Point) Point */

/**
 * @param {number} start
 * @param {number} end
 * @param {number} t
 * @returns {number}
 */
export const lerp = (start, end, t) => start + (end - start) * t

/**
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 * @param {Point} d
 * @returns
 */
export const getIntersection = (a, b, c, d) => {
  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y)
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)

  if (bottom) {
    const t = tTop / bottom
    const u = uTop / bottom

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        y: lerp(a.y, b.y, t),
        x: lerp(a.x, b.x, t),
        offset: t
      }
    }
  }

  return null
}

/** @typedef (import('./types').XYArray) XYArray */

/**
 * @param {XYArray} polygonA
 * @param {XYArray} polygonB
 * @return {boolean}
 */
export const isPolygonsIntersect = (polygonA, polygonB) => {
  for (let i = 0, j = polygonA.length; i < j; i++) {
    for (let k = 0, l = polygonB.length; k < l; k++) {
      const touch = getIntersection(
        polygonA[i],
        polygonA[(i + 1) % polygonA.length],
        polygonB[k],
        polygonB[(k + 1) % polygonB.length]
      )

      if (touch) return true
    }
  }

  return false
}

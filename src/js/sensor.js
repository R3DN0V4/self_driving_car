/** @typedef {import('./car').Car} Car */

import Config from './config'
import {lerp, getIntersection} from './utils'

export default class Sensor {
  rayCount = Config.defaultCarRayCount
  rayLength = Config.defaultCarRayLength
  raySpread = Math.PI / 2
  /** @type {Array<Array<{x: number; y: number}>>} */
  rays = []
  /** @type {Array<{y: number; x: number; offset: number}>} */
  readings = []

  #car

  /** @param {Car} car */
  constructor(car) {
    this.#car = car
  }

  /**
   * @param {Array<Array<{y: number; x: number}>>} roadBorders
   * @returns {Sensor} */
  refresh(roadBorders) {
    this.#castRays()

    this.readings = []

    for (let i = 0, j = this.rays.length; i < j; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders))
    }

    return this
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @returns {Sensor}
   */
  draw(context) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1]

      if (this.readings[i]) end = this.readings[i]

      context.beginPath()
      context.strokeStyle = Config.defaultCarRayLineColor
      context.lineWidth = Config.defaultCarRayLineWidth
      context.moveTo(this.rays[i][0].x, this.rays[i][0].y)
      context.lineTo(end.x, end.y)
      context.stroke()

      context.beginPath()
      context.strokeStyle = 'black'
      context.moveTo(this.rays[i][1].x, this.rays[i][1].y)
      context.lineTo(end.x, end.y)
      context.stroke()
    }

    return this
  }

  #castRays() {
    this.rays = []

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)) +
        this.#car.angle
      const rayStart = {x: this.#car.x, y: this.#car.y}
      const rayEnd = {
        x: this.#car.x - (Math.sin(rayAngle) * this.rayLength), // prettier-ignore
        y: this.#car.y - (Math.cos(rayAngle) * this.rayLength) // prettier-ignore
      }

      this.rays.push([rayStart, rayEnd])
    }

    return this
  }

  /**
   * @param {Array<{x: number; y: number}>} ray
   * @param {Array<Array<{y: number; x: number}>>} roadBorders
   * @return {{y: number; x: number; offset: number}}
   */
  #getReading(ray, roadBorders) {
    /** @type {Array<{y: number; x: number; offset: number}>} */
    const touches = []

    for (let i = 0, j = roadBorders.length; i < j; i++) {
      const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1])

      if (touch) touches.push(touch)
    }

    if (!touches.length) return null

    const offsets = touches.map(touch => touch.offset)
    const minOffset = Math.min(...offsets)
    const nearestTouch = touches.find(touch => touch.offset === minOffset)

    return nearestTouch
  }
}

/** @typedef (import('./types').PointArray) PointArray */
/** @typedef (import('./types').PointMatrix) PointMatrix */
/** @typedef (import('./types').XYMatrix) XYMatrix */
/** @typedef {import('./car').Car} Car */

import Config from './config'
import {lerp, getIntersection} from './utils'

export default class Sensor {
  #car
  /** @type {XYMatrix} */
  #rays = []
  /** @type {PointArray} */
  #readings = []

  /**
   * @param {Car} car
   * @param {number} raySpread
   * @param {number} rayCount
   * @param {number} rayLength
   */
  constructor(
    car,
    raySpread = Math.PI / 2,
    rayCount = Config.defaultCarRayCount,
    rayLength = Config.defaultCarRayLength
  ) {
    this.raySpread = raySpread
    this.rayCount = rayCount
    this.rayLength = rayLength

    this.#car = car
  }

  /**
   * @param {XYMatrix} roadBorders
   * @returns {Sensor} */
  refresh(roadBorders) {
    this.#castRays()

    this.#readings = []

    for (let i = 0, j = this.#rays.length; i < j; i++) {
      this.#readings.push(this.#getReading(this.#rays[i], roadBorders))
    }

    return this
  }

  get rays() {
    return this.#rays
  }

  get readings() {
    return this.#readings
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @returns {Sensor}
   */
  draw(context) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.#rays[i][1]

      if (this.#readings[i]) end = this.#readings[i]

      context.beginPath()
      context.strokeStyle = Config.defaultCarRayLineColor
      context.lineWidth = Config.defaultCarRayLineWidth
      context.moveTo(this.#rays[i][0].x, this.#rays[i][0].y)
      context.lineTo(end.x, end.y)
      context.stroke()

      context.beginPath()
      context.strokeStyle = 'black'
      context.moveTo(this.#rays[i][1].x, this.#rays[i][1].y)
      context.lineTo(end.x, end.y)
      context.stroke()
    }

    return this
  }

  #castRays() {
    this.#rays = []

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)) +
        this.#car.angle
      const rayStart = {y: this.#car.y, x: this.#car.x}
      const rayEnd = {
        y: this.#car.y - Math.cos(rayAngle) * this.rayLength,
        x: this.#car.x - Math.sin(rayAngle) * this.rayLength
      }

      this.#rays.push([rayStart, rayEnd])
    }

    return this
  }

  /**
   * @param {PointArray} ray
   * @param {XYMatrix} roadBorders
   * @return {PointMatrix}
   */
  #getReading(ray, roadBorders) {
    /** @type {PointArray} */
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

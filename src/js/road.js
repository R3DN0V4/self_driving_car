import Config from './config'
import {INFINITY} from './constants'
import {lerp} from './utils'

export default class Road {
  #top = -INFINITY
  #bottom = INFINITY
  #left
  #right
  #borders

  /**
   * @param {number} x
   * @param {number} width
   * @param {number} laneWidth
   * @param {string} laneColor
   * @param {number} laneCount
   */
  constructor(x, width, laneWidth, laneColor, laneCount) {
    this.x = x
    this.width = width
    this.laneWidth = laneWidth
    this.laneCount = laneCount
    this.laneColor = laneColor

    this.#left = this.x - (this.width / 2) // prettier-ignore
    this.#right = this.x + (this.width / 2) // prettier-ignore

    const topLeft = {x: this.#left, y: this.#top}
    const bottomLeft = {x: this.#left, y: this.#bottom}
    const topRight = {x: this.#right, y: this.#top}
    const bottomRight = {x: this.#right, y: this.#bottom}

    this.#borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight]
    ]
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @returns {Road}
   */
  draw(context) {
    context.lineWidth = this.laneWidth
    context.strokeStyle = this.laneColor

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.#left, this.#right, i / this.laneCount)

      context.setLineDash([Config.defaultLaneSegmentSize, Config.defaultLaneSegmentSize])
      context.beginPath()
      context.moveTo(x, this.#top)
      context.lineTo(x, this.#bottom)
      context.stroke()
    }

    context.setLineDash([])

    this.#borders.forEach(border => {
      context.beginPath()
      context.moveTo(border[0].x, border[0].y)
      context.lineTo(border[1].x, border[1].y)
      context.stroke()
    })

    return this
  }

  /**
   * @param {number} laneIndex
   * @return {number}
   */
  getLaneCenterX(laneIndex = Math.floor(Config.defaultLaneCount / 2)) {
    const laneWidth = this.width / this.laneCount
    const laneCenterX = this.#left + (laneWidth / 2) + (Math.min(laneIndex, this.laneCount - 1) * laneWidth) // prettier-ignore

    return laneCenterX
  }

  get top() {
    return this.#top
  }

  get bottom() {
    return this.#bottom
  }

  get left() {
    return this.#left
  }

  get right() {
    return this.#right
  }

  get borders() {
    return this.#borders
  }
}

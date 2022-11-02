/** @typedef (import('./types').XYArray) XYArray */
/** @typedef (import('./types').XYMatrix) XYMatrix */

import Config from './config'
import Controls from './controls'
import Sensor from './sensor'
import {CAR_CONTROL_TYPE} from './constants'
import {isPolygonsIntersect} from './utils'

/**
 * @typedef {Object} Car
 * @property {number} speedLimit
 * @property {number} acceleration
 * @property {number} rotationAngle
 * @property {XYArray} polygon
 * @property {number} speed
 * @property {number} angle
 * @property {boolean} isDamaged
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {(context: CanvasRenderingContext2D) => Car} draw
 * @property {() => Car} refresh
 */
export default class Car {
  speedLimit
  acceleration = Config.defaultCarAcceleration
  rotationAngle = Config.defaultCarRotationAngle
  speed = 0
  angle = 0
  isDamaged = false

  #friction = Config.friction
  /** @type {XYArray}  */
  #polygon
  #controls
  #sensor

  /**
   * @param {'CONTROLLED' | 'DUMMY'} controlType
   * @param {number} y
   * @param {number} x
   * @param {number} width
   * @param {number} height
   */
  constructor(
    controlType,
    y,
    x,
    speedLimit = Config.defaultCarSpeedLimit,
    width = Config.defaultCarWidth,
    height = Config.defaultCarHeight
  ) {
    this.y = y
    this.x = x
    this.width = width
    this.height = height
    this.speedLimit = speedLimit

    this.#controls = new Controls(controlType)

    if (controlType === CAR_CONTROL_TYPE.CONTROLLED) {
      this.#sensor = new Sensor(this)
    }
  }

  get polygon() {
    return this.#polygon
  }

  /**
   * @param {XYMatrix} roadBorders
   * @param {Array<Car>} traffic
   * @returns {Car} */
  refresh(roadBorders, traffic) {
    if (!this.isDamaged) {
      this.#preventDrivingInPlace().#handleControls().#limitSpeed().#setSpeedWhileDriving().#rotate()
      this.#polygon = this.#createPolygon()
      this.isDamaged = this.#assessDamage(roadBorders, traffic)
    }

    if (this.#sensor) this.#sensor.refresh(roadBorders, traffic)

    return this
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {string} color
   * @returns {Car}
   */
  draw(context, color = Config.defaultCarColor, damagedColor = Config.defaultDamagedCarColor) {
    if (this.isDamaged) context.fillStyle = damagedColor
    else context.fillStyle = color

    context.beginPath()
    context.moveTo(this.#polygon[0].x, this.#polygon[0].y)

    for (let i = 1, j = this.#polygon.length; i < j; i++) {
      context.lineTo(this.#polygon[i].x, this.#polygon[i].y)
    }

    context.fill()

    if (this.#sensor) this.#sensor.draw(context)

    return this
  }

  #preventDrivingInPlace() {
    if (Math.abs(this.speed) < this.#friction) this.speed = 0

    return this
  }

  #handleControls() {
    if (this.#controls.forward) this.speed += this.acceleration
    if (this.#controls.reverse) this.speed -= this.acceleration

    if (this.speed) {
      const flip = this.speed > 0 ? 1 : -1

      if (this.#controls.left) this.angle += this.rotationAngle * flip
      if (this.#controls.right) this.angle -= this.rotationAngle * flip
    }

    return this
  }

  #limitSpeed() {
    if (this.speed > this.speedLimit) this.speed = this.speedLimit
    else {
      const reverseSpeed = -this.speedLimit / 2

      if (this.speed < reverseSpeed) this.speed = reverseSpeed
    }

    return this
  }

  #setSpeedWhileDriving() {
    if (this.speed > 0) this.speed -= this.#friction
    if (this.speed < 0) this.speed += this.#friction

    return this
  }

  #rotate() {
    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed

    return this
  }

  #createPolygon() {
    /** @type {XYArray} */
    const points = []
    const alpha = Math.atan2(this.width, this.height)
    const radius = Math.hypot(this.width, this.height) / 2

    points.push({
      y: this.y - Math.cos(this.angle - alpha) * radius,
      x: this.x - Math.sin(this.angle - alpha) * radius
    })

    points.push({
      y: this.y - Math.cos(this.angle + alpha) * radius,
      x: this.x - Math.sin(this.angle + alpha) * radius
    })

    points.push({
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius
    })

    points.push({
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius
    })

    return points
  }

  /**
   * @param {XYMatrix} roadBorders
   * @param {Array<Car>} traffic
   * @return {boolean}
   */
  #assessDamage(roadBorders, traffic) {
    for (let i = 0, j = roadBorders.length; i < j; i++) {
      if (isPolygonsIntersect(this.#polygon, roadBorders[i])) return true
    }

    for (let i = 0, j = traffic.length; i < j; i++) {
      if (isPolygonsIntersect(this.#polygon, traffic[i].polygon)) return true
    }

    return false
  }
}

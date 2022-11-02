/** @typedef (import('./types').XYMatrix) XYMatrix */

import Config from './config'
import Controls from './controls'
import Sensor from './sensor'

/**
 * @typedef {Object} Car
 * @property {number} speedLimit
 * @property {number} acceleration
 * @property {number} rotationAngle
 * @property {number} speed
 * @property {number} angle
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {(context: CanvasRenderingContext2D) => Car} draw
 * @property {() => Car} refresh
 */
export default class Car {
  speedLimit = Config.defaultCarSpeedLimit
  acceleration = Config.defaultCarAcceleration
  rotationAngle = Config.defaultCarRotationAngle
  speed = 0
  angle = 0

  #friction = Config.friction
  #controls = new Controls()
  #sensor

  /**
   * @param {number} y
   * @param {number} x
   * @param {number} width
   * @param {number} height
   */
  constructor(y, x, width, height) {
    this.y = y
    this.x = x
    this.width = width
    this.height = height

    this.#sensor = new Sensor(this)
  }

  /**
   * @param {XYMatrix} roadBorders
   * @returns {Car} */
  refresh(roadBorders) {
    this.#preventDrivingInPlace().#handleControls().#limitSpeed().#setSpeedWhileDriving().#rotate()

    this.#sensor.refresh(roadBorders)

    return this
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @returns {Car}
   */
  draw(context) {
    context.save()

    context.translate(this.x, this.y)
    context.rotate(-this.angle)

    context.beginPath()
    context.rect(-this.width / 2, -this.height / 2, this.width, this.height)
    context.fill()

    context.restore()

    this.#sensor.draw(context)

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
}

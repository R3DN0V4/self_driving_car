import Config from './config'
import Controls from './controls'

export default class Car {
  speedLimit = Config.defaultCarSpeedLimit
  acceleration = Config.defaultCarAcceleration
  rotationAngle = Config.defaultCarRotationAngle
  speed = 0
  angle = 0

  #friction = Config.friction
  #controls = new Controls()

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

    return this
  }

  /** @returns {Car} */
  update() {
    this.#preventDrivingInPlace().#handleControls().#limitSpeed().#setSpeedWhileDriving().#rotate()

    return this
  }

  /** @returns {Car} */
  #preventDrivingInPlace() {
    if (Math.abs(this.speed) < this.#friction) this.speed = 0

    return this
  }

  /** @returns {Car} */
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

  /** @returns {Car} */
  #limitSpeed() {
    if (this.speed > this.speedLimit) this.speed = this.speedLimit
    else {
      const reverseSpeed = -this.speedLimit / 2

      if (this.speed < reverseSpeed) this.speed = reverseSpeed
    }

    return this
  }

  /** @returns {Car} */
  #setSpeedWhileDriving() {
    if (this.speed > 0) this.speed -= this.#friction
    if (this.speed < 0) this.speed += this.#friction

    return this
  }

  /** @returns {Car} */
  #rotate() {
    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed

    return this
  }
}

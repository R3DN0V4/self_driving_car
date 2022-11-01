import config from './config'
import Controls from './controls'

export default class Car {
  speedLimit = config.carDefaultSpeedLimit
  acceleration = config.carDefaultAcceleration
  rotationAngle = config.carDefaultRotationAngle
  speed = 0
  angle = 0

  #friction = config.friction
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

  /** @param {CanvasRenderingContext2D} context */
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

  update() {
    this.#preventDrivingInPlace().#handleControls().#limitSpeed().#drive().#rotate()

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

  #drive() {
    if (this.speed < 0) this.speed += this.#friction
    if (this.speed > 0) this.speed -= this.#friction

    return this
  }

  #rotate() {
    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed

    return this
  }
}

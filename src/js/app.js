import Car from './car'

/** @type {HTMLCanvasElement}  */
const canvas = document.querySelector('.canvas')

canvas.height = window.innerHeight
canvas.width = 200

const context = canvas.getContext('2d')

const carHeight = 50
const carWidth = 30
const carY = canvas.height / 2
const carX = canvas.width / 2
const car = new Car(carY, carX, carWidth, carHeight)

const animate = () => {
  canvas.height = window.innerHeight

  car.draw(context).update()

  requestAnimationFrame(animate)
}

animate()

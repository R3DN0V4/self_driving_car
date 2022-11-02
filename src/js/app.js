import Config from './config'
import Road from './road'
import Car from './car'

const canvas = document.querySelector('canvas')

canvas.height = Config.defaultCanvasHeight
canvas.width = Config.defaultCanvasWidth

const context = canvas.getContext('2d')

const road = new Road(
  canvas.width / 2,
  canvas.width * Config.roadEdgeMargin,
  Config.defaultLaneWidth,
  Config.defaultLaneColor,
  Config.defaultLaneCount
)

const car = new Car(Config.defaultCarY, road.getLaneCenterX(1), Config.defaultCarWidth, Config.defaultCarHeight)

const animate = () => {
  canvas.height = window.innerHeight

  context.save()
  context.translate(0, -car.y + Config.defaultCarY)

  road.draw(context)
  car.refresh(road.borders).draw(context)

  context.restore()

  requestAnimationFrame(animate)
}

animate()

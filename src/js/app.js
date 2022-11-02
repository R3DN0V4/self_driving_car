import Config from './config'
import Road from './road'
import Car from './car'
import {CAR_CONTROL_TYPE} from './constants'

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

const traffic = [new Car(CAR_CONTROL_TYPE.DUMMY, 100, road.getLaneCenterX(1), Config.defaultCarSpeedLimit / 2)]

const playerCar = new Car(
  CAR_CONTROL_TYPE.CONTROLLED,
  Config.defaultCarY,
  road.getLaneCenterX(1),
  Config.defaultCarSpeedLimit
)

const animate = () => {
  canvas.height = window.innerHeight

  context.save()
  context.translate(0, -playerCar.y + Config.defaultCarY)

  road.draw(context)

  for (let i = 0, j = traffic.length; i < j; i++) {
    traffic[i].refresh(road.borders, []).draw(context, 'red')
  }

  playerCar.refresh(road.borders, traffic).draw(context, 'blue')

  context.restore()

  requestAnimationFrame(animate)
}

animate()

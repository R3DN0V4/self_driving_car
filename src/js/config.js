export default class Config {
  static {
    this.defaultCanvasHeight = window.innerHeight
    this.defaultCanvasWidth = 200

    this.roadEdgeMargin = 0.9
    this.defaultLaneWidth = 5
    this.defaultLaneColor = 'white'
    this.defaultLaneCount = 3
    this.defaultLaneSegmentSize = 20

    this.defaultCarHeight = 50
    this.defaultCarWidth = 30

    this.friction = 0.05

    this.carEdgeY = 0.7
    this.defaultCarY = this.defaultCanvasHeight * this.carEdgeY
    this.defaultCarSpeedLimit = 3
    this.defaultCarAcceleration = 0.2
    this.defaultCarRotationAngle = 0.03
  }
}

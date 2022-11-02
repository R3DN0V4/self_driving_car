export default class Config {
  static {
    this.defaultCanvasHeight = window.innerHeight
    this.defaultCanvasWidth = 200

    this.roadEdgeMargin = 0.9
    this.defaultLaneWidth = 5
    this.defaultLaneColor = 'white'
    this.defaultLaneCount = 3
    this.defaultLaneSegmentSize = 20

    this.friction = 0.05

    this.defaultCarHeight = 50
    this.defaultCarWidth = 30

    this.defaultCarEdgeY = 0.7
    this.defaultCarY = this.defaultCanvasHeight * this.defaultCarEdgeY

    this.defaultCarSpeedLimit = 3
    this.defaultCarAcceleration = 0.2
    this.defaultCarRotationAngle = 0.03

    this.defaultCarRayLineWidth = 2
    this.defaultCarRayLineColor = 'yellow'
    this.defaultCarRayCount = 5
    this.defaultCarRayLength = 150
  }
}

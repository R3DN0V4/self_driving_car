import {CAR_CONTROL_TYPE} from './constants'

export default class Controls {
  #forward = false
  #reverse = false
  #left = false
  #right = false

  /** @type {Record<typeof CAR_CONTROL_TYPE, () => void>} */
  #type = {
    [CAR_CONTROL_TYPE.CONTROLLED]: () => this.#addKeyboardListeners(),
    [CAR_CONTROL_TYPE.DUMMY]: () => (this.#forward = true)
  }

  /** @type {Record<string, (flag: boolean) => void>} */
  #keys = {
    ArrowUp: flag => (this.#forward = flag),
    ArrowDown: flag => (this.#reverse = flag),
    ArrowLeft: flag => (this.#left = flag),
    ArrowRight: flag => (this.#right = flag)
  }

  /** @param {'CONTROLLED' | 'DUMMY'} controlType */
  constructor(controlType) {
    this.#type[controlType]()
  }

  get forward() {
    return this.#forward
  }

  get reverse() {
    return this.#reverse
  }

  get left() {
    return this.#left
  }

  get right() {
    return this.#right
  }

  #addKeyboardListeners() {
    document.addEventListener('keydown', event => this.#keys[event.key]?.(true))
    document.addEventListener('keyup', event => this.#keys[event.key]?.(false))

    return this
  }
}

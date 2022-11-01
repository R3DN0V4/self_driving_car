export default class Controls {
  forward = false
  reverse = false
  left = false
  right = false

  /** @type {Record<string, (flag: boolean) => void>} */
  #keys = {
    ArrowUp: flag => (this.forward = flag),
    ArrowDown: flag => (this.reverse = flag),
    ArrowLeft: flag => (this.left = flag),
    ArrowRight: flag => (this.right = flag)
  }

  constructor() {
    this.#addKeyboardListeners()
  }

  /** @returns {Controls} */
  #addKeyboardListeners() {
    document.addEventListener('keydown', event => this.#keys[event.key]?.(true))
    document.addEventListener('keyup', event => this.#keys[event.key]?.(false))

    return this
  }
}

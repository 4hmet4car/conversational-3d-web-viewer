import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'

export default class Cursor extends EventEmitter
{
    constructor(sizes)
    {
        super()

        this.sizes = sizes

        // Setup
        this.position = new THREE.Vector2()
        this.speed = new THREE.Vector2()
        this.lastMoveTime = 0

        // Cursor move event
        window.addEventListener('pointermove', this.pointerMove)
        // window.addEventListener('pointerdown', this.pointerDown)
    }

    pointerMove = (_event) =>
    {
        const now = _event.timeStamp

        const previousX = this.position.x
        const previousY = this.position.y

        this.position.x = (_event.clientX / this.sizes.width) * 2 - 1
        this.position.y = -((_event.clientY / this.sizes.height) * 2 - 1)

        const delta = Math.max(now - this.lastMoveTime, 0.001)

        this.lastMoveTime = now

        this.speed.x = (this.position.x - previousX) / delta
        this.speed.y = (this.position.y - previousY) / delta
        
        this.trigger('pointermove')
    }

    pointerDown = (_event) =>
    {
        this.position.x = (_event.clientX / this.sizes.width) * 2 - 1
        this.position.y = -((_event.clientY / this.sizes.height) * 2 - 1)
        this.trigger('pointerdown')
    }

    update()
    {
        // Converge the cursor speed to 0, if not the last speed will stay as the
        // current speed indefinetely
        this.speed.x += (0 - this.speed.x) * 0.1
        this.speed.y += (0 - this.speed.y) * 0.1
    }
}
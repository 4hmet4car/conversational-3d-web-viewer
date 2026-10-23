import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'

export default class Cursor extends EventEmitter
{
    constructor(sizes)
    {
        super()

        this.sizes = sizes

        // Setup
        this.position = new THREE.Vector2(9999,9999)
        this.velocity = new THREE.Vector2(0,0)
        this.speed = 0
        this.lastMoveTime = 0

        // Cursor move event
        window.addEventListener('pointermove', this.pointerMove)
        // window.addEventListener('pointerdown', this.pointerDown)
    }

    pointerMove = (_event) =>
    {
        const previousX = this.position.x
        const previousY = this.position.y

        this.position.x = (_event.clientX / this.sizes.width) * 2 - 1
        this.position.y = -((_event.clientY / this.sizes.height) * 2 - 1)

        this.velocity.x = this.position.x - previousX
        this.velocity.y = this.position.y - previousY

        this.speed = this.velocity.length()
        
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
        this.velocity.x += (0 - this.velocity.x) * 0.1
        this.velocity.y += (0 - this.velocity.y) * 0.1
        this.speed = this.velocity.length()
    }
}
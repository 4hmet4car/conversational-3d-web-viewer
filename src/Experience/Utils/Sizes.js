import * as THREE from 'three'
import EventEmitter from "./EventEmitter.js"

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        //Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        // Multiply resolution with pixel ratio to make it adapt to multiple screens
        this.resolution = new THREE.Vector2(this.width * this.pixelRatio, this.height * this.pixelRatio)
        this.aspectRatio = this.width / this.height

        //Resize event
        window.addEventListener('resize', this.resize)

    }

    //Resize method
    resize = () =>
    {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.resolution.set(this.width * this.pixelRatio, this.height * this.pixelRatio)
        this.aspectRatio = this.width / this.height

        this.trigger('resize')
    }
}
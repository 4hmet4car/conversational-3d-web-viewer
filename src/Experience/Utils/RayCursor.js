import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'

export default class RayCursor extends EventEmitter
{
    constructor(cursor, camera)
    {
        super()

        this.cursor = cursor
        this.camera = camera

        // Setup
        this.objectToIntersect = null
        this.instance = new THREE.Raycaster()

        this.cursor.on('pointermove', () =>
        {
            this.castRay()
        })
    }

    castRay()
    {
        if (this.objectToIntersect)
        {
            this.instance.setFromCamera(this.cursor.position, this.camera.instance)
            this.intersect = this.instance.intersectObject(this.objectToIntersect)

            if (this.intersect.length)
            {
                this.trigger('intersect')
            }
        }
    }
}
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Heritage from './Heritage.js'
import POIManager from './PointOfInterest/POIManager.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
    }

    init()
    {
        this.environment = new Environment()
        this.heritage = new Heritage()
        this.POIManager = new POIManager()
    }

    resize()
    {
        // if (this.particles)
        // {
        //     this.particles.resize()
        // }
    }

    update()
    {
        if (this.POIManager)
        {
            this.POIManager.update()
        }
    }
}
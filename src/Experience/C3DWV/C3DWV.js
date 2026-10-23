import Experience from '../Experience.js'
import Environment from './Environment.js'
import Heritage from './Heritage.js'
import PointsOfInterest from './PointOfInterest/PointsOfInterest.js'

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
        this.pointsOfInterest = new PointsOfInterest()
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
        if (this.pointsOfInterest)
        {
            this.pointsOfInterest.update()
        }
    }
}
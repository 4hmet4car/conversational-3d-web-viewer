import Experience from "../Experience.js"
import Heritage from "./Heritage.js"


export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () =>
        {
            // Setup
            this.heritage = new Heritage()
        })

        this.resources.startLoading()
    }

    resize()
    {
        // if (this.suzanne && this.sphere && this.torusKnot && this.halftone)
        // {
        //     this.halftone.resize()
        // }
    }

    update()
    {
        // if (this.suzanne && this.sphere && this.torusKnot && this.halftone)
        // {
        //     this.halftone.update()
        //     this.suzanne.update()
        //     this.sphere.update()
        //     this.torusKnot.update()
        // }
    }
}
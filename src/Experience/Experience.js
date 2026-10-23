import * as THREE from 'three'

import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Splash from './Splash/Splash.js'
import Debug from './Utils/Debug.js'
import Resources from './Utils/Resources.js'
import Sizes from './Utils/Sizes.js'
import Statistics from './Utils/Statistics.js'
import Time from './Utils/Time.js'
import World from './C3DWV/C3DWV.js'

import sources from './sources.js'


// import Cursor from './Utils/Cursor.js'
// import RayCursor from './Utils/RayCursor.js'
// import PostProcessing from './PostProcessing/PostProcessing.js'

let instance = null

export default class Experience
{
    constructor(canvas)
    {
        if (instance)
        {
            return instance
        }

        instance = this

        //Global access
        window.experience = this

        //Options
        this.canvas = canvas

        //Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.splash = new Splash()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        // this.cursor = new Cursor(this.sizes) 
        // this.rayCursor = new RayCursor(this.cursor, this.camera)
        // this.postProcessing = new PostProcessing()

        this.world = new World()

        this.statistics = new Statistics()

        // Sizes resize event
        this.sizes.on('resize', () =>
        {
            this.resize() //It is important to use fat arrows to not to loose the context
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })

        // Resources ready event
        this.resources.on('ready', () =>
        {
            this.world.init()
            this.splash.remove()
        })

        // Resources itemLoaded event
        this.resources.on('itemLoaded', () =>
        {
            this.splash.loadingBar.progress(this.resources.loaded, this.resources.toLoad)
        })

        // Start Loading
        this.resources.startLoading()
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        // this.postProcessing.resize()
        this.world.resize()
    }

    update()
    {
        if (this.statistics.active)
        {
            this.statistics.FPSCounter?.begin()
        }

        this.splash.update()
        this.camera.update()
        // this.cursor.update()
        this.world.update()
        this.renderer.update()
        // this.postProcessing.update()

        if (this.statistics.active)
        {
            this.statistics.FPSCounter?.end()
        }
    }

    destroy()
    {
        //Destroy event emitters
        this.sizes.off('resize')
        this.time.off('tick')
        // this.cursor.off('pointerdown')

        //Destroy event listeners
        window.removeEventListener('resize', this.sizes.resize)
        // window.removeEventListener('pointermove',this.cursor.pointerMove)
        // window.removeEventListener('pointerdown',this.cursor.pointerDown)

        //Traverse the whole scene
        this.scene.traverse((child) =>
        {
            //Test if it'a mesh
            if (child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                //Loop through the material properties
                for (const key in child.material)
                {
                    const value = child.material[key]

                    //Test if there is a dispose funtion
                    if (value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
        {
            this.debug.ui.destroy()
        }

        if (this.statistics.active)
        {
            this.statistics.destroy()
        }
    }
}
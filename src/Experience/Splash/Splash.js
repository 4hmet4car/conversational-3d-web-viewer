import * as THREE from 'three'
import Experience from "../Experience.js"
import Overlay from './Overlay.js'
import LoadingBar from './LoadingBar.js'

export default class Splash
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.setOverlay()
        this.setLoadingBar()
    }

    setLoadingBar()
    {
        this.loadingBar = new LoadingBar()
    }

    setOverlay()
    {
        this.overlay = new Overlay()
    }

    remove()
    {
        this.overlay.fadeOut()
        this.loadingBar.fadeOut()
    }

    update()
    {
        if (this.overlay && this.loadingBar)
        {
            this.overlay.update()
            this.loadingBar.update()
        }
    }

    destroy()
    {

    }
}
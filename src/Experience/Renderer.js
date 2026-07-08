import * as THREE from 'three'

import Experience from './Experience.js'

import { rendererParameters } from './parameters.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        this.setRendererInstance()
        this.setDebug()
    }

    setRendererInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            // antialias: true,
        })
        this.instance.setClearColor(rendererParameters.clearColor)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        // this.instance.toneMappingExposure = 2
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFShadowMap
        this.instance.shadowMap.autoUpdate = false
    }

    setDebug()
    {
        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder("Renderer")

            this.debugFolder
                .addColor(rendererParameters, 'clearColor')
                .onChange(() =>
                {
                    this.instance.setClearColor(rendererParameters.clearColor)
                })
        }
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}
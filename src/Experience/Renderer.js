import * as THREE from 'three'

import Experience from './Experience.js'

import { RENDERER } from './constants.js'

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

        // console.log(this.instance.info)
        // console.log(this.instance.capabilities)
        // console.log(this.instance.capabilities.getMaxAnisotropy())
        // console.log(this.instance.getPixelRatio())
    }

    setRendererInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            powerPreference: RENDERER.POWER_PREFERENCE,
            antialias: RENDERER.ANTIALIAS,
        })
        this.instance.setClearColor(rendererParameters.clearColor)
        this.instance.shadowMap.enabled = RENDERER.SHADOWMAP.ENABLED
        this.instance.shadowMap.type = RENDERER.SHADOWMAP.TYPE
        this.instance.shadowMap.autoUpdate = RENDERER.SHADOWMAP.AUTO_UPDATE
        this.instance.shadowMap.needsUpdate = RENDERER.SHADOWMAP.NEEDS_UPDATE
        this.instance.toneMapping = RENDERER.TONEMAPPING.TYPE
        this.instance.toneMappingExposure = RENDERER.TONEMAPPING.EXPOSURE
        this.instance.outputColorSpace = RENDERER.OUTPUT_COLOR_SPACE
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
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

        if (this.effectComposer)
        {
            this.effectComposer.setSize(this.sizes.width, this.sizes.height)
            this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
        }
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}
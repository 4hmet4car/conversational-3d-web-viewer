import * as THREE from 'three'
import Experience from '../Experience.js'
import loadingBarVertexShader from './shaders/loadingBar/vertex.glsl'
import loadingBarFragmentShader from './shaders/loadingBar/fragment.glsl'
import { LOADING_BAR } from '../constants.js'

export default class LoadingBar
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.setGeometry()
        this.setMaterial()
        this.setInstance()
        this.setState()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(2, 0.02, 1, 1)
        this.geometry.deleteAttribute('uv')
        this.geometry.deleteAttribute('normal')
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: loadingBarVertexShader,
            fragmentShader: loadingBarFragmentShader,
            uniforms:
            {
                uAlpha: new THREE.Uniform(1),
                uProgress: new THREE.Uniform(0),
            },
        })
    }

    setInstance()
    {
        this.instance = new THREE.Mesh(this.geometry, this.material)
        this.instance.renderOrder = 1
        this.scene.add(this.instance)
    }

    progress(resourcesLoaded, resourcesToLoad)
    {
        this.targetProgressRatio = resourcesLoaded / resourcesToLoad
    }

    setState()
    {
        this.canFadeOut = false
        this.finishTime = 0
        this.currentProgressRatio = 0
        this.targetProgressRatio = 0
    }

    fadeOut()
    {
        this.finishTime = this.time.secondsElapsed
        this.canFadeOut = true
    }

    update()
    {
        this.currentProgressRatio += (this.targetProgressRatio - this.currentProgressRatio) * this.time.delta / 100
        this.material.uniforms.uProgress.value = this.currentProgressRatio

        if (!this.canFadeOut) return
        const secondsElapsedAfterLoad = this.time.secondsElapsed - this.finishTime
        const remainingAlpha = 1 - secondsElapsedAfterLoad / LOADING_BAR.ANIMATION.FADE_OUT_DURATION
        this.material.uniforms.uAlpha.value = Math.max(remainingAlpha, 0)

        this.fadeOutComplete = remainingAlpha < 0

        if (this.fadeOutComplete)
        {
            this.destroy()
            this.canFadeOut = false
        }
    }

    destroy()
    {
        this.scene.remove(this.instance)
        this.geometry.dispose()
        this.material.dispose()
    }
}
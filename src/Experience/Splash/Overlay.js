import * as THREE from 'three'
import Experience from "../Experience.js"

import overlayVertexShader from './shaders/overlay/vertex.glsl'
import overlayFragmentShader from './shaders/overlay/fragment.glsl'

import { OVERLAY } from '../constants.js'

export default class Overlay
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.setGeometry()
        this.setMaterial()
        this.setOverlay()
        this.setState()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(
            OVERLAY.GEOMETRY.WIDTH,
            OVERLAY.GEOMETRY.HEIGHT,
            OVERLAY.GEOMETRY.WIDTH_SEGMENTS,
            OVERLAY.GEOMETRY.HEIGHT_SEGMENTS,
        )
        this.geometry.deleteAttribute('uv')
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: overlayVertexShader,
            fragmentShader: overlayFragmentShader,
            uniforms:
            {
                uAlpha: new THREE.Uniform(1),
            },
        })
    }

    setOverlay()
    {
        this.overlay = new THREE.Mesh(this.geometry, this.material)
        this.overlay.renderOrder = 1
        this.scene.add(this.overlay)
    }

    setState()
    {
        this.canFadeOut = false
        this.finishTime = 0
    }

    fadeOut()
    {
        this.finishTime = this.time.secondsElapsed
        this.canFadeOut = true
    }

    update()
    {
        if (!this.canFadeOut) return
        const secondsElapsedAfterLoad = this.time.secondsElapsed - this.finishTime
        const remainingAlpha = 1 - secondsElapsedAfterLoad / OVERLAY.ANIMATION.FADE_OUT_DURATION
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
        this.scene.remove(this.overlay)
        this.geometry.dispose()
        this.material.dispose()
    }
}
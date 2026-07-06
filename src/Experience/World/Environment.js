import * as THREE from 'three'

import Experience from "../Experience.js"

import { environmentParameters } from '../parameters.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.setPointLight()
        this.setDebug()
    }

    setPointLight()
    {
        this.pointLight = new THREE.PointLight(environmentParameters.pointLight.color, environmentParameters.pointLight.intensity)
        // this.pointLight.castShadow = true
        // this.pointLight.shadow.camera.far = 15
        // this.pointLight.shadow.mapSize.set(1024, 1024)
        // this.pointLight.shadow.normalBias = 0.05
        this.pointLight.position.x = environmentParameters.pointLight.positionX
        this.pointLight.position.y = environmentParameters.pointLight.positionY
        this.pointLight.position.z = environmentParameters.pointLight.positionZ
        this.scene.add(this.pointLight)
    }

    setDebug()
    {
        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Environment')

            this.debugFolder
                .add(this.pointLight, 'intensity')
                .name('PointLightIntesity')
                .min(0)
                .max(1000)
                .step(0.001)

            this.debugFolder
                .add(this.pointLight.position, 'x')
                .name('PointLightX')
                .min(-5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.pointLight.position, 'y')
                .name('PointLightY')
                .min(-5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.pointLight.position, 'z')
                .name('PointLightZ')
                .min(-5)
                .max(5)
                .step(0.001)
        }
    }
}
import * as THREE from 'three'
import Experience from "../Experience.js"

export default class Heritage
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setHeritage()
        this.setMaterials()
    }

    setHeritage()
    {
        this.heritage = this.resources.items.heritage.scene
        this.heritage.scale.set(2.5, 2.5, 2.5)
        this.heritage.rotation.y = Math.PI * 0.5
        this.scene.add(this.heritage)
    }

    setMaterials()
    {
        this.heritage.traverse((child) =>
        {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.material.envMapIntensity = 2.5
                child.castShadow = true
                child.receiveShadow = true
                child.material.needsUpdate = true
            }
        })
    }

    update()
    {
        
    }

}
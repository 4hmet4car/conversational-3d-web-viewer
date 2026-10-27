import * as THREE from 'three'
import Experience from "../Experience.js"
import { HERITAGE } from '../constants.js'

export default class Heritage
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setHeritage()
        this.setHeritageCollider()
        this.setMaterials()
    }

    setHeritage()
    {
        this.heritage = this.resources.items.heritage.scene.children[0]
        this.heritage.rotation.y = HERITAGE.MESH.ROTATION_Y
        this.scene.add(this.heritage)
    }

    setHeritageCollider()
    {
        this.collider = this.resources.items.collider.scene.children[0]
        this.collider.material = new THREE.MeshBasicMaterial({ visible: false })
        this.heritage.add(this.collider)
    }

    setMaterials()
    {
        this.heritage.traverse((child) =>
        {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                const colorMap = child.material.map
                child.material = new THREE.MeshBasicMaterial({
                    map: colorMap
                })
            }
        })
    }

    update()
    {

    }

}
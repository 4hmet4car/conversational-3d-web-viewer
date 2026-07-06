import * as THREE from 'three'
import Experience from "../Experience.js"

export default class Heritage
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setMaterial()
        this.setModel()
    }

    setMaterial()
    {
        this.wallDiffuseTexture = this.resources.items.wallDiffuseTexture
        this.wallDiffuseTexture.wrapS = THREE.RepeatWrapping
        this.wallDiffuseTexture.wrapT = THREE.RepeatWrapping
        this.wallDiffuseTexture.repeat.x = 8
        this.wallDiffuseTexture.repeat.y = 8
        this.wallARMTexture = this.resources.items.wallARMTexture
        this.wallARMTexture.wrapS = THREE.RepeatWrapping
        this.wallARMTexture.wrapT = THREE.RepeatWrapping
        this.wallARMTexture.repeat.x = 8
        this.wallARMTexture.repeat.y = 8
        this.wallNormalTexture = this.resources.items.wallNormalTexture
        this.wallNormalTexture.wrapS = THREE.RepeatWrapping
        this.wallNormalTexture.wrapT = THREE.RepeatWrapping
        this.wallNormalTexture.repeat.x = 8
        this.wallNormalTexture.repeat.y = 8
        // this.paintDiffuseTexture = this.resources.items.paintDiffuseTexture
        this.material = new THREE.MeshStandardMaterial({
            map: this.wallDiffuseTexture,
            aoMap: this.wallARMTexture,
            roughness: this.wallARMTexture,
            metalnessMap: this.wallARMTexture,
            normalMap: this.wallNormalTexture,
        })
    }
    
    setModel()
    {
        this.model = this.resources.items.colombarioWallsModel.scene.children[0]
        console.log(this.model)
        this.model.material = this.material
        this.scene.add(this.model)
    }
}
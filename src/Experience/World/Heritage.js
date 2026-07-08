import * as THREE from 'three'
import Experience from "../Experience.js"

import vertexVaryingDefinitionInjection from './shaders/injections/vertexVaryingDefinitionInjection.glsl'
import vertexVaryingAssigmentInjection from './shaders/injections/vertexVaryingAssigmentInjection.glsl'
import fragmentUniformVaryingInjection from './shaders/injections/fragmentUniformVaryingInjection.glsl'
import fragmentTextureInjection from './shaders/injections/fragmentTextureInjection.glsl'

export default class Heritage
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes

        this.setTextures()
        this.setMaterials()
        this.setGeometries()
        this.setModels()
        this.setPointsOfInterest()
    }

    setTextures()
    {
        this.potDiffuseTexture = this.resources.items.potDiffuseTexture
        this.potDiffuseTexture.colorSpace = THREE.SRGBColorSpace

        this.wallDiffuseTexture = this.resources.items.wallDiffuseTexture
        this.wallDiffuseTexture.colorSpace = THREE.SRGBColorSpace
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

        this.paintDiffuseTexture = this.resources.items.paintDiffuseTexture
        this.paintDiffuseTexture.colorSpace = THREE.SRGBColorSpace
        this.paintDiffuseTexture.flipY = false

        this.customWallsMaterialUniforms = {
            uPaintDiffuseTexture: { value: this.paintDiffuseTexture }
        }

        this.floorDiffuseTexture = this.resources.items.floorDiffuseTexture
        this.floorDiffuseTexture.colorSpace = THREE.SRGBColorSpace
        this.floorDiffuseTexture.wrapS = THREE.RepeatWrapping
        this.floorDiffuseTexture.wrapT = THREE.RepeatWrapping
        this.floorDiffuseTexture.repeat.x = 5
        this.floorDiffuseTexture.repeat.y = 5

        this.floorARMTexture = this.resources.items.floorARMTexture
        this.floorARMTexture.wrapS = THREE.RepeatWrapping
        this.floorARMTexture.wrapT = THREE.RepeatWrapping
        this.floorARMTexture.repeat.x = 5
        this.floorARMTexture.repeat.y = 5

        this.floorNormalTexture = this.resources.items.floorNormalTexture
        this.floorNormalTexture.wrapS = THREE.RepeatWrapping
        this.floorNormalTexture.wrapT = THREE.RepeatWrapping
        this.floorNormalTexture.repeat.x = 5
        this.floorNormalTexture.repeat.y = 5
    }

    setMaterials()
    {
        this.potMaterial = new THREE.MeshStandardMaterial({
            map: this.potDiffuseTexture,
        })

        this.wallsMaterial = new THREE.MeshStandardMaterial({
            map: this.wallDiffuseTexture,
            aoMap: this.wallARMTexture,
            roughnessMap: this.wallARMTexture,
            metalnessMap: this.wallARMTexture,
            normalMap: this.wallNormalTexture,
        })

        this.wallsMaterial.onBeforeCompile = (shader) =>
        {
            shader.uniforms.uPaintDiffuseTexture = this.customWallsMaterialUniforms.uPaintDiffuseTexture

            // Vertex varying injection
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                vertexVaryingDefinitionInjection
            )

            shader.vertexShader = shader.vertexShader.replace(
                '#include <fog_vertex>',
                vertexVaryingAssigmentInjection
            )

            // Fragment uniform, varying injection
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                fragmentUniformVaryingInjection
            )

            // Wall paint texture injection
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                fragmentTextureInjection
            )
        }

        this.columnMaterial = new THREE.MeshStandardMaterial({
            map: this.wallDiffuseTexture,
            aoMap: this.wallARMTexture,
            roughnessMap: this.wallARMTexture,
            metalnessMap: this.wallARMTexture,
            normalMap: this.wallNormalTexture,
        })

        this.floorMaterial = new THREE.MeshStandardMaterial({
            map: this.floorDiffuseTexture,
            aoMap: this.floorARMTexture,
            roughnessMap: this.floorARMTexture,
            metalnessMap: this.floorARMTexture,
            normalMap: this.floorNormalTexture,
        })
    }

    setGeometries()
    {
        this.floorGeometry = new THREE.PlaneGeometry(7.5, 7.5)
    }

    setModels()
    {
        this.colombarioWallsModel = this.resources.items.colombarioWallsModel.scene.children[0]
        this.colombarioWallsModel.material = this.wallsMaterial
        this.colombarioWallsModel.castShadow = true
        this.colombarioWallsModel.receiveShadow = true

        this.colombarioStairModel = this.resources.items.colombarioStairModel.scene.children[0]
        this.colombarioStairModel.material = this.columnMaterial
        this.colombarioStairModel.castShadow = true
        this.colombarioStairModel.receiveShadow = true

        this.colombarioColumnModel = this.resources.items.colombarioColumnModel.scene.children[0]
        this.colombarioColumnModel.material = this.columnMaterial
        this.colombarioColumnModel.castShadow = true
        this.colombarioColumnModel.receiveShadow = true

        this.colombarioPotsModel = this.resources.items.colombarioPotsModel.scene.children[0]
        this.colombarioPotsModel.material = this.potMaterial
        this.colombarioPotsModel.castShadow = true
        this.colombarioPotsModel.receiveShadow = true

        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial)
        this.floorMesh.rotation.x = -Math.PI * 0.5
        this.floorMesh.receiveShadow = true

        this.scene.add(
            this.colombarioWallsModel,
            this.colombarioStairModel,
            this.colombarioColumnModel,
            this.colombarioPotsModel,
            this.floorMesh
        )
    }

    setPointsOfInterest()
    {
        this.pointsOfInterest = [
            {
                position: new THREE.Vector3(-0.146561, 3.03457, -2.32326),
                element: document.querySelector('.point-0')
            }
        ]
    }

    update()
    {
        for (const point of this.pointsOfInterest)
        {
            const screenPosition = point.position.clone()
            screenPosition.project(this.camera.instance)

            if (screenPosition.z > -1 && screenPosition.z < 1)
            {
                const translateX = screenPosition.x * this.sizes.width * 0.5
                const translateY = -screenPosition.y * this.sizes.height * 0.5
                point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
            }
        }
    }
}
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

        this.setTextures()
        this.setMaterial()
        this.setModel()
    }

    setTextures()
    {
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

        this.customUniforms = {
            uPaintDiffuseTexture: { value: this.paintDiffuseTexture }
        }
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            transparent: true,
            map: this.wallDiffuseTexture,
            aoMap: this.wallARMTexture,
            roughness: this.wallARMTexture,
            metalnessMap: this.wallARMTexture,
            normalMap: this.wallNormalTexture,
        })

        this.material.onBeforeCompile = (shader) =>
        {
            shader.uniforms.uPaintDiffuseTexture = this.customUniforms.uPaintDiffuseTexture

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

            console.log(shader.vertexShader)
        }
    }

    setModel()
    {
        this.model = this.resources.items.colombarioWallsModel.scene.children[0]
        this.model.material = this.material
        this.scene.add(this.model)
    }
}
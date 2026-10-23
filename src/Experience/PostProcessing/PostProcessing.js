import { WebGLRenderTarget } from 'three'

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

import TintPass from './CustomPostProcessinPasses/TintPass/TintPass.js'
import DisplacementPass from './CustomPostProcessinPasses/DisplacementPass/DisplacementPass.js'

import Experience from "../Experience.js"
import { postProcessingParameters } from "../parameters.js"

export default class PostProcessing
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.renderer = this.experience.renderer
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.time = this.experience.time


        this.setRenderTarget()
        this.setEffectComposer()

        this.resources.on('ready', () =>
        {
            this.setRenderPasses()
        })

        this.setDebug()
    }

    setRenderTarget()
    {
        this.renderTarget = new WebGLRenderTarget(
            this.sizes.width,
            this.sizes.height,
            {
                samples: this.renderer.instance.getPixelRatio() === 1 ? 2 : 0
            }
        )
    }

    setEffectComposer()
    {
        this.effectComposer = new EffectComposer(this.renderer.instance, this.renderTarget)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    setRenderPasses()
    {
        // Render Pass is almost always the first one
        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(this.renderPass)

        this.dotScreenPass = new DotScreenPass()
        this.dotScreenPass.enabled = postProcessingParameters.dotScreenPass.enabled
        this.effectComposer.addPass(this.dotScreenPass)

        this.glitchPass = new GlitchPass()
        this.glitchPass.enabled = postProcessingParameters.glitchPass.enabled
        this.glitchPass.goWild = postProcessingParameters.glitchPass.goWild
        this.effectComposer.addPass(this.glitchPass)

        this.rgbShiftPass = new ShaderPass(RGBShiftShader)
        this.rgbShiftPass.enabled = postProcessingParameters.rgbShiftPass.enabled
        this.effectComposer.addPass(this.rgbShiftPass)

        this.unrealBloomPass = new UnrealBloomPass()
        this.unrealBloomPass.enabled = postProcessingParameters.unrealBloomPass.enabled
        this.effectComposer.addPass(this.unrealBloomPass)

        // Custom tint pass
        this.tintPass = new ShaderPass(TintPass)
        this.tintPass.enabled = postProcessingParameters.tintPass.enabled
        this.effectComposer.addPass(this.tintPass)

        // // Custom displacement pass
        this.displacementPass = new ShaderPass(DisplacementPass)
        console.log(this.resources.items.interfaceNormalMap)
        this.displacementPass.material.uniforms.uNormalMap.value = this.resources.items.interfaceNormalMap
        this.displacementPass.material.uniforms.uResolution.value = this.sizes.resolution
        this.displacementPass.enabled = postProcessingParameters.displacementPass.enabled
        this.effectComposer.addPass(this.displacementPass)

        // Gamma correction pass is always after the classic passses
        this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        this.effectComposer.addPass(this.gammaCorrectionPass)

        // // Anti-alias pass, always the last
        if (this.renderer.instance.getPixelRatio() === 1 && !this.renderer.instance.capabilities.isWebGL2)
        {
            this.setSMAAPass()
        }
    }

    async setSMAAPass()
    {
        const { SMAAPass } = await import('three/examples/jsm/postprocessing/SMAAPass.js')
        this.smaaPass = new SMAAPass()
        this.effectComposer.addPass(this.smaaPass)
    }

    setDebug()
    {
        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder("PostProcessing")

            this.debugFolder
                .add(postProcessingParameters.dotScreenPass, 'enabled')
                .name('DotScreenPass')
                .onChange(() =>
                {
                    this.dotScreenPass.enabled = postProcessingParameters.dotScreenPass.enabled
                })

            this.debugFolder
                .add(postProcessingParameters.glitchPass, 'enabled')
                .name('GlitchPass')
                .onChange(() =>
                {
                    this.glitchPass.enabled = postProcessingParameters.glitchPass.enabled
                    glitchPassGoWild.show(glitchPassGoWild._hidden)
                })

            const glitchPassGoWild = this.debugFolder
                .add(postProcessingParameters.glitchPass, 'goWild')
                .name('GlitchPass goWild')
                .onChange(() =>
                {
                    this.glitchPass.goWild = postProcessingParameters.glitchPass.goWild
                })
                .show(postProcessingParameters.glitchPass.enabled)

            this.debugFolder
                .add(postProcessingParameters.rgbShiftPass, 'enabled')
                .name('RGBShiftPass')
                .onChange(() =>
                {
                    this.rgbShiftPass.enabled = postProcessingParameters.rgbShiftPass.enabled
                })

            this.debugFolder
                .add(postProcessingParameters.unrealBloomPass, 'enabled')
                .name('UnrealBloomPass')
                .onChange(() =>
                {
                    this.unrealBloomPass.enabled = postProcessingParameters.unrealBloomPass.enabled
                    unrealBloomPassStrength.show(unrealBloomPassStrength._hidden)
                    unrealBloomPassRadius.show(unrealBloomPassRadius._hidden)
                    unrealBloomPassThreshold.show(unrealBloomPassThreshold._hidden)
                })

            const unrealBloomPassStrength = this.debugFolder
                .add(postProcessingParameters.unrealBloomPass, 'strength')
                .name('UnrealBloomPassStrength')
                .min(0)
                .max(2)
                .step(0.001)
                .onChange(() =>
                {
                    this.unrealBloomPass.strength = postProcessingParameters.unrealBloomPass.strength
                })
                .show(postProcessingParameters.unrealBloomPass.enabled)

            const unrealBloomPassRadius = this.debugFolder
                .add(postProcessingParameters.unrealBloomPass, 'radius')
                .name('UnrealBloomPassRadius')
                .min(0)
                .max(2)
                .step(0.001)
                .onChange(() =>
                {
                    this.unrealBloomPass.radius = postProcessingParameters.unrealBloomPass.radius
                })
                .show(postProcessingParameters.unrealBloomPass.enabled)

            const unrealBloomPassThreshold = this.debugFolder
                .add(postProcessingParameters.unrealBloomPass, 'threshold')
                .name('UnrealBloomPassThreshold')
                .min(0)
                .max(1)
                .step(0.001)
                .onChange(() =>
                {
                    this.unrealBloomPass.threshold = postProcessingParameters.unrealBloomPass.threshold
                })
                .show(postProcessingParameters.unrealBloomPass.enabled)

            this.debugFolder
                .add(postProcessingParameters.tintPass, 'enabled')
                .name('TintPass')
                .onChange(() =>
                {
                    this.tintPass.enabled = postProcessingParameters.tintPass.enabled
                    tintPassRed.show(tintPassRed._hidden)
                    tintPassGreen.show(tintPassGreen._hidden)
                    tintPassBlue.show(tintPassBlue._hidden)
                })

            const tintPassRed = this.debugFolder
                .add(postProcessingParameters.tintPass, 'r')
                .name('TintRed')
                .min(-1)
                .max(1)
                .step(0.001)
                .onChange(() =>
                {
                    this.tintPass.material.uniforms.uTint.value.r = postProcessingParameters.tintPass.r
                })
                .show(postProcessingParameters.tintPass.enabled)

            const tintPassGreen = this.debugFolder
                .add(postProcessingParameters.tintPass, 'g')
                .name('TintGreen')
                .min(-1)
                .max(1)
                .step(0.001)
                .onChange(() =>
                {
                    this.tintPass.material.uniforms.uTint.value.g = postProcessingParameters.tintPass.g
                })
                .show(postProcessingParameters.tintPass.enabled)

            const tintPassBlue = this.debugFolder
                .add(postProcessingParameters.tintPass, 'b')
                .name('TintGreen')
                .min(-1)
                .max(1)
                .step(0.001)
                .onChange(() =>
                {
                    this.tintPass.material.uniforms.uTint.value.b = postProcessingParameters.tintPass.b
                })
                .show(postProcessingParameters.tintPass.enabled)


            this.debugFolder
                .add(postProcessingParameters.displacementPass, 'enabled')
                .name('DisplacementPass')
                .onChange(() =>
                {
                    this.displacementPass.enabled = postProcessingParameters.displacementPass.enabled
                })
        }
    }

    resize()
    {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.effectComposer.render()
    }
}
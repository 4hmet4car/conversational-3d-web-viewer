import displacementPassVertexShader from './vertexShader.glsl'
import displacementPassFragmentShader from './fragmentShader.glsl'

export default {
    uniforms: {
        tDiffuse: { value: null },
        uNormalMap: { value: null },
        uResolution: { value: null }
    },
    vertexShader: displacementPassVertexShader,
    fragmentShader: displacementPassFragmentShader,
}
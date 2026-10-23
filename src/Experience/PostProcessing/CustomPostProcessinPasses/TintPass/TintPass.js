import tintPassVertexShader from './vertexShader.glsl'
import tintPassFragmentShader from './fragmentShader.glsl'

import { postProcessingParameters } from '../../../parameters'

export default {
    uniforms: {
        tDiffuse: { value: null },
        uTint: {
            value: {
                r: postProcessingParameters.tintPass.r,
                g: postProcessingParameters.tintPass.g,
                b: postProcessingParameters.tintPass.b
            }
        }
    },
    vertexShader: tintPassVertexShader,
    fragmentShader: tintPassFragmentShader,
}
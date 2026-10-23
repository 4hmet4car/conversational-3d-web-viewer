export const cameraParameters = {
    enablePan: false,
    enableZoom: true,
    enableRotate: true,
    enableDamping: false,
}

export const rendererParameters = {
    clearColor: '#000000',
}

export const postProcessingParameters = {
    dotScreenPass: {
        enabled: false,
    },
    glitchPass: {
        enabled: false,
        goWild: false,
    },
    rgbShiftPass: {
        enabled: false,
    },
    unrealBloomPass: {
        enabled: false,
        strength: 0.3,
        radius: 1,
        threshold: 0.6,
    },
    tintPass: {
        enabled: false,
        r: 1,
        g: 0,
        b: 0,
    },
    displacementPass: {
        enabled: true,
        r: 0,
        g: 1,
        b: 0,
    },
}
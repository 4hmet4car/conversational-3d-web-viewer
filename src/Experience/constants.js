import * as THREE from 'three'

export const CAMERA = {
    FOV: 35,
    POSITION_X: 5.8,
    POSITION_Y: 3.3,
    POSITION_Z: -2.3,
    NEAR: 0.1,
    FAR: 100,
    ZOOM: 1,
}

export const ORBIT_CONTROLS = {
    TARGET_X: -0.35,
    TARGET_Y: 0.4,
    TARGET_Z: -0.15,
    MAX_POLAR_ANGLE: 0.5 * Math.PI,
}

export const RENDERER = {
    POWER_PREFERENCE: 'high-performance',
    ANTIALIAS: true,
    OUTPUT_COLOR_SPACE: THREE.SRGBColorSpace,
    SHADOWMAP: {
        ENABLED: false,
        TYPE: THREE.PCFShadowMap,
        AUTO_UPDATE: false,
        NEEDS_UPDATE: true,
    },
    TONEMAPPING: {
        EXPOSURE: 3,
        TYPE: THREE.ReinhardToneMapping,
    }
}

export const OVERLAY = {
    GEOMETRY: {
        WIDTH: 2,
        HEIGHT: 2,
        WIDTH_SEGMENTS: 1,
        HEIGHT_SEGMENTS: 1,
    },
    ANIMATION: {
        FADE_OUT_DURATION: 3
    },
}

export const LOADING_BAR = {
    GEOMETRY: {
        WIDTH: 2,
        HEIGHT: 2,
        WIDTH_SEGMENTS: 1,
        HEIGHT_SEGMENTS: 1,
    },
    ANIMATION: {
        FADE_OUT_DURATION: 2
    },
}
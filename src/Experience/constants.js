import * as THREE from 'three'

export const CAMERA = {
    FOV: 75,
    POSITION_X: 4,
    POSITION_Y: 1,
    POSITION_Z: -4,
    NEAR: 0.1,
    FAR: 100,
    ZOOM: 1,
}

export const ORBIT_CONTROLS = {
    TARGET_X: 0,
    TARGET_Y: 0,
    TARGET_Z: 0,
}

export const RENDERER = {
    POWER_PREFERENCE: 'high-performance',
    ANTIALIAS: true,
    OUTPUT_COLOR_SPACE: THREE.SRGBColorSpace,
    SHADOWMAP: {
        ENABLED: true,
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
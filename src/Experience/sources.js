/**
 * This module exports the sources
 * that are utilized in the project.
 * 
 * This module exports an array that
 * has each source as a seperate object.
 * 
 * -----------TYPES-----------
 * --> image
 * --> cubeTexture
 * --> texture
 * --> gltfModel
 * --> dracoModel
 */

export default [
    // {
    //     name: 'glowImage',
    //     type: 'image',
    //     path: '/glow.png'
    // },
    // {
    //     name: 'environmentMapTexture',
    //     type: 'cubeTexture',
    //     path: [
    //         '/textures/environmentMaps/3/px.jpg',
    //         '/textures/environmentMaps/3/nx.jpg',
    //         '/textures/environmentMaps/3/py.jpg',
    //         '/textures/environmentMaps/3/ny.jpg',
    //         '/textures/environmentMaps/3/pz.jpg',
    //         '/textures/environmentMaps/3/nz.jpg',
    //     ]
    // },
    {
        name: 'collider',
        type: 'dracoModel',
        path: '/models/nileCollider.glb'
    },
    {
        name: 'heritage',
        type: 'dracoModel',
        path: '/models/nile.glb'
    },
    // {
    //     name: 'heritage',
    //     type: 'gltfModel',
    //     path: '/models/DamagedHelmet/glTF/DamagedHelmet.gltf'
    // },
    // {
    //     name: 'displacementMap',
    //     type: 'texture',
    //     path: '/textures/displacementMap.png'
    // },
    // {
    //     name: 'pictureTexture2',
    //     type: 'texture',
    //     path: '/picture-2.png'
    // },
    // {
    //     name: 'pictureTexture3',
    //     type: 'texture',
    //     path: '/picture-3.png'
    // },
    // {
    //     name: 'pictureTexture4',
    //     type: 'texture',
    //     path: '/picture-4.png'
    // },
    // {
    //     name: 'spruitSunrise',
    //     type: 'HDRTexture',
    //     path: '/spruit_sunrise.hdr'
    // },
]
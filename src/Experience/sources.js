/**
 * This module exports the sources
 * that are utilized in the project.
 * 
 * This module exports an array that
 * has each source as a seperate object.
 * 
 * -----------TYPES-----------
 * --> cubeTexture
 * --> texture
 * --> gltfModel
 * --> dracoModel
 */

export default [
    {
        name: 'colombarioWallsModel',
        type: 'dracoModel',
        path: '/models/colombario_walls.glb'
    },
    {
        name: 'colombarioColumnModel',
        type: 'dracoModel',
        path: '/models/colombario_column.glb'
    },
    {
        name: 'colombarioStairModel',
        type: 'dracoModel',
        path: '/models/colombario_stair.glb'
    },
    {
        name: 'colombarioPotsModel',
        type: 'dracoModel',
        path: '/models/colombario_pots.glb'
    },
    {
        name: 'potDiffuseTexture',
        type: 'texture',
        path: '/textures/pot_diffuse.jpg'
    },
    {
        name: 'wallDiffuseTexture',
        type: 'texture',
        path: '/textures/wall_diffuse.jpg'
    },
    {
        name: 'wallNormalTexture',
        type: 'texture',
        path: '/textures/wall_normal.png'
    },
    {
        name: 'wallARMTexture',
        type: 'texture',
        path: '/textures/wall_arm.jpg'
    },
    {
        name: 'paintDiffuseTexture',
        type: 'texture',
        path: '/textures/paint_diffuse.png'
    },
        {
        name: 'floorDiffuseTexture',
        type: 'texture',
        path: '/textures/floor_diffuse.jpg'
    },
    {
        name: 'floorNormalTexture',
        type: 'texture',
        path: '/textures/floor_normal.png'
    },
    {
        name: 'floorARMTexture',
        type: 'texture',
        path: '/textures/floor_arm.jpg'
    },
]
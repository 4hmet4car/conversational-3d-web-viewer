import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Experience from './Experience.js'
import { CAMERA, ORBIT_CONTROLS } from './constants.js'
import { cameraParameters } from './parameters.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience() //Singleton
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        this.setPerspectiveCameraInstance()
        // this.setOrtographicCameraInstance()
        this.setOrbitControls()
        this.setDebug()

        // window.addEventListener('mousedown',()=>{
        //     console.log(this.controls)
        //     console.log(this.instance.position)
        // })
    }

    // Perspective camera instance
    setPerspectiveCameraInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            CAMERA.FOV,
            this.sizes.aspectRatio,
            CAMERA.NEAR,
            CAMERA.FAR)

        this.instance.position.set(
            CAMERA.POSITION_X / CAMERA.ZOOM,
            CAMERA.POSITION_Y / CAMERA.ZOOM,
            CAMERA.POSITION_Z / CAMERA.ZOOM)
       
        this.scene.add(this.instance)
    }

    // Orthographic camera instance
    setOrtographicCameraInstance()
    {
        this.isOrthographic = true
        this.left = -this.sizes.aspectRatio
        this.right = this.sizes.aspectRatio
        this.top = 1
        this.bottom = -1

        this.instance = new THREE.OrthographicCamera(
            this.left,
            this.right,
            this.top,
            this.bottom,
            CAMERA.NEAR,
            CAMERA.FAR)

        this.instance.position.set(
            CAMERA.POSITION_X,
            CAMERA.POSITION_Y,
            CAMERA.POSITION_Z)

        this.instance.zoom = CAMERA.ZOOM
        this.instance.updateProjectionMatrix()

        this.scene.add(this.instance)
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target.x = ORBIT_CONTROLS.TARGET_X
        this.controls.target.y = ORBIT_CONTROLS.TARGET_Y
        this.controls.target.z = ORBIT_CONTROLS.TARGET_Z
        this.controls.enablePan = cameraParameters.enablePan
        this.controls.enableZoom = cameraParameters.enableZoom
        this.controls.enableRotate = cameraParameters.enableRotate
        this.controls.enableDamping = cameraParameters.enableDamping
    }

    setDebug()
    {
        //Debug
        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder("Camera")

            this.debugFolder
                .add(cameraParameters, 'enablePan')
                .onChange(() =>
                {
                    this.controls.enablePan = cameraParameters.enablePan
                })
            
            this.debugFolder
                .add(cameraParameters, 'enableZoom')
                .onChange(() =>
                {
                    this.controls.enableZoom = cameraParameters.enableZoom
                })
            
            this.debugFolder
                .add(cameraParameters, 'enableRotate')
                .onChange(() =>
                {
                    this.controls.enableRotate = cameraParameters.enableRotate
                })
            
            this.debugFolder
                .add(cameraParameters, 'enableDamping')
                .onChange(() =>
                {
                    this.controls.enableDamping = cameraParameters.enableDamping
                })
        }
    }

    resize()
    {
        if (this.isOrthographic)
        {
            this.instance.left = -this.sizes.aspectRatio
            this.instance.right = this.sizes.aspectRatio
            this.instance.updateProjectionMatrix()
        } else
        {
            this.instance.aspect = this.sizes.aspectRatio
            this.instance.updateProjectionMatrix()
        }
    }

    update()
    {
        this.controls.update()
    }
}
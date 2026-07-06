import EventEmitter from "./EventEmitter.js"

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        //Options
        this.sources = sources

        //Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0
        this.loaders = {}
    }

    async startLoading()
    {
        if (!this.toLoad) {
            this.trigger('ready')
            return
        }
        
        for (const source of this.sources)
        {
            switch (source.type)
            {
                case 'gltfModel':
                    if (!this.loaders.gltfLoader)
                    {
                        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js")
                        this.loaders.gltfLoader = new GLTFLoader()
                    }
                    this.loaders.gltfLoader.load(source.path, (file) =>
                    {
                        this.sourceLoaded(source, file, "%cGLTF Loaded: ", "background-color: navy")
                    })
                    break;

                case 'dracoModel':
                    if (!this.loaders.dracoLoader)
                    {
                        const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
                            import("three/examples/jsm/loaders/GLTFLoader.js"),
                            import("three/examples/jsm/loaders/DRACOLoader.js")
                        ])

                        this.loaders.dracoLoader = new DRACOLoader()
                        this.loaders.dracoLoader.setDecoderPath('./draco/')

                        this.loaders.gltfLoader = this.loaders.gltfLoader || new GLTFLoader()
                        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
                    }
                    this.loaders.gltfLoader.load(source.path, (file) =>
                    {
                        this.sourceLoaded(source, file, "%cDraco Loaded: ", "background-color: navy")
                    })
                    break;

                case 'texture':
                    if (!this.loaders.textureLoader)
                    {
                        const { TextureLoader } = await import("three")
                        this.loaders.textureLoader = new TextureLoader()
                    }
                    this.loaders.textureLoader.load(source.path, (file) =>
                    {
                        this.sourceLoaded(source, file, "%cTexture Loaded: ", "background-color: maroon")
                    })
                    break;

                case 'cubeTexture':
                    if (!this.loaders.cubeTextureLoader)
                    {
                        const { CubeTextureLoader } = await import("three")
                        this.loaders.cubeTextureLoader = new CubeTextureLoader()
                    }
                    this.loaders.cubeTextureLoader.load(source.path, (file) =>
                    {
                        this.sourceLoaded(source, file, "%cCube Texture Loaded: ", "background-color: darkgreen")
                    })
                    break;

                default:
                    console.log('Unknown type!')
            }
        }
    }

    sourceLoaded(source, file, logMessage, logColor)
    {
        console.log(logMessage + source.name, logColor)

        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }
}
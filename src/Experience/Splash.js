import Experience from './Experience.js'

export default class Splash
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.splashElement = document.querySelector('.splash')
        this.loadingBarElement = document.querySelector('.loading-bar')

        this.resources.on('itemLoaded', () =>
        {
            const progressRatio = this.resources.loaded / this.resources.toLoad
            this.loadingBarElement.style.transform = `scaleX(${progressRatio})`
        })

        this.resources.on('ready', () =>
        {
            setTimeout(() =>
            {
                this.splashElement.classList.remove('visible')
            }, 500)

            setTimeout(() =>
            {
                this.splashElement.remove()
            }, 2500)
        })
    }
}
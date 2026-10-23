import Stats from 'stats.js'

export default class Statistics
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if (this.active)
        {
            this.FPSCounter = new Stats()
            this.FPSCounter.showPanel(0)
            document.body.appendChild(this.FPSCounter.dom)
        }
    }

    destroy()
    {
        this.FPSCounter.dom?.remove()
        this.FPSCounter = null
    }
}
import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.start = performance.now()
        this.current = this.start
        this.elapsed = 0
        this.secondsElapsed = this.elapsed * 0.001
        this.delta = 16

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = performance.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        this.secondsElapsed = this.elapsed * 0.001

        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick() //It is important to use fat arrows to not to loose the context
        })
    }
}
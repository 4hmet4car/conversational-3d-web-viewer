import { Vector3 } from 'three'
import Experience from '../../Experience.js'
import EventEmitter from '../../Utils/EventEmitter.js'

export default class PointOfInterest extends EventEmitter
{
    constructor(pointIndex, pointDescription, pointCoordinates, rayCaster)
    {
        super()

        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.rayCaster = rayCaster

        this.setPointOfInterest(pointCoordinates)
        this.setAnchor(pointIndex)
        this.setChatBox()
        this.setPointDescription(pointDescription)
        this.setInputField()
        this.addEventListeners()
    }

    setPointOfInterest(pointCoordinates)
    {
        this.pointOfInterest = document.createElement('div')
        this.pointOfInterest.classList.add('pointOfInterest')
        document.body.appendChild(this.pointOfInterest)

        this.coordinates = pointCoordinates
        this.screenCoordinates = new Vector3()
        this.active = false
    }

    setAnchor(pointIndex)
    {
        this.anchor = document.createElement('button')
        this.anchor.type = 'button'
        this.anchor.classList.add('anchor')
        this.anchor.textContent = pointIndex
        this.pointOfInterest.appendChild(this.anchor)
    }

    setChatBox()
    {
        this.chatBox = document.createElement('div')
        this.chatBox.classList.add('chatBox')
        this.pointOfInterest.appendChild(this.chatBox)
    }

    setPointDescription(pointDescription)
    {
        this.pointDescription = document.createElement('div')
        this.pointDescription.classList.add('llmAnswer')
        this.pointDescription.textContent = pointDescription
        this.chatBox.appendChild(this.pointDescription)
    }

    setInputField()
    {
        this.inputField = document.createElement('input')
        this.inputField.type = 'text'
        this.inputField.maxLength = 500
        this.inputField.classList.add('inputField')
        this.inputField.placeholder = 'Ask about this...'
        this.pointOfInterest.appendChild(this.inputField)
    }

    addEventListeners()
    {
        this.anchor.addEventListener('click', () =>
        {
            this.active = !this.active
            this.pointOfInterest.classList.toggle('active', this.active)
            this.chatBox.classList.toggle('visible', this.active)
            this.inputField.classList.toggle('visible', this.active)
            this.trigger('clicked')
        })

        this.inputField.addEventListener('keydown', (event) =>
        {
            // event.isComposing is for users that use IME (Input Method Editor)
            // IME is used for special characters in Japanese, Chinese etc.
            if (event.key === 'Enter' && !event.isComposing)
            {
                const message = this.inputField.value.trim()
                if (!message) return
                this.askQuestion(message)
                this.inputField.value = ''
            }
        })
    }

    askQuestion(question)
    {
        const userQuestion = document.createElement('div')
        userQuestion.classList.add('userQuestion')
        userQuestion.textContent = question
        this.chatBox.appendChild(userQuestion)
        this.chatBox.scrollTop = this.chatBox.scrollHeight //This scrolls everything down in the div

        this.requestAnswer(question)
    }

    // This utilizes the fetch api to make a request to the specified end point
    // Since fetch and response.json() return promises, the method is async
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    async requestAnswer(question)
    {
        this.inputField.disabled = true
        const llmAnswer = this.prepareAnswer()

        try
        {
            // fetch() promise resolves when the server responds with headers and status code (initial handshake)
            // you use post since you are sending data to the backend
            // you set header since many middleware look at it first to know how to parse the data in the body
            // you stringify the json object bc you can not sent live json object with http but only rough text
            const serverResponse = await fetch('/api/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: question }),
            })

            // response.ok is true for statuses from 200 through 299
            if (!serverResponse.ok)
            {
                throw new Error(`Response status: ${serverResponse.status}`)
            }

            // response.json() promise resolves when entire text body finishes downloading
            // .json() is a method that belongs to node.js responses
            // .json() reads a response body and parses it as a json object
            const llmServerResponse = await serverResponse.json()
            this.answerQuestion(llmAnswer, llmServerResponse.answer)
        } catch (error)
        {
            console.error(error.message);
            this.answerQuestion(llmAnswer, 'Try again later.')
        }
    }

    prepareAnswer()
    {
        const llmAnswer = document.createElement('div')
        llmAnswer.classList.add('llmAnswer')
        llmAnswer.textContent = "Waiting answer..."
        this.chatBox.appendChild(llmAnswer)
        this.chatBox.scrollTop = this.chatBox.scrollHeight
        return llmAnswer
    }

    answerQuestion(llmAnswer, answer)
    {
        llmAnswer.textContent = answer
        this.inputField.disabled = false
        this.chatBox.scrollTop = this.chatBox.scrollHeight
        if (this.active) this.inputField.focus()
    }

    calculateScreenCoordinates()
    {
        this.screenCoordinates.copy(this.coordinates)
        this.screenCoordinates.project(this.camera.instance)
    }

    castRay()
    {
        this.rayCaster.setFromCamera(this.screenCoordinates, this.camera.instance)
        this.intersects = this.rayCaster.intersectObjects(this.scene.children, true)
    }

    togglePointVisibility()
    {
        if (!this.intersects.length)
        {
            this.anchor.classList.add('visible')
        }
        else
        {
            const intersectionDistance = this.intersects[0].distance
            const pointDistance = this.coordinates.distanceTo(this.camera.instance.position)
            if (intersectionDistance < pointDistance)
            {
                this.anchor.classList.remove('visible')
                this.deactivate()
            }
            else
            {
                this.anchor.classList.add('visible')
            }
        }
    }

    move()
    {
        const translateX = this.screenCoordinates.x * this.sizes.width * 0.5
        const translateY = - this.screenCoordinates.y * this.sizes.height * 0.5

        this.pointOfInterest.style.transform =
            `
            translate(${translateX}px, ${translateY}px) translate(-50%, calc(var(--anchor-size) / -2))
            `
    }

    update()
    {
        this.calculateScreenCoordinates()
        this.castRay()
        this.togglePointVisibility()
        this.move()
    }

    deactivate()
    {
        this.active = false
        this.pointOfInterest.classList.remove('active')
        this.chatBox.classList.remove('visible')
        this.inputField.classList.remove('visible')
    }
}
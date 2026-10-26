import { Vector3 } from 'three'
import Experience from '../../Experience.js'
import EventEmitter from '../../Utils/EventEmitter.js'

export default class PointOfInterest extends EventEmitter
{
    constructor(pointIndex, pointDescription, pointCoordinates, rayCaster, heritage)
    {
        super()

        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes

        this.pointIndex = pointIndex
        this.pointDescription = pointDescription
        this.pointCoordinates = pointCoordinates
        this.rayCaster = rayCaster
        this.heritage = heritage

        this.setPointOfInterest(this.pointCoordinates)
        this.setAnchor(this.pointIndex)
        this.setChatBox()
        this.setPointDescription(this.pointDescription)
        this.setInputField()
        this.addDocumentEventListeners()
        this.addCameraEventListeners()
    }

    setPointOfInterest(pointCoordinates)
    {
        this.pointOfInterest = document.createElement('div')
        this.pointOfInterest.classList.add('pointOfInterest')
        document.body.appendChild(this.pointOfInterest)

        this.coordinates = new Vector3(
            pointCoordinates.x,
            pointCoordinates.y,
            pointCoordinates.z
        )

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

        this.chatHistory = []
    }

    setPointDescription(description)
    {
        this.description = document.createElement('div')
        this.description.classList.add('llmAnswer')
        this.description.textContent = description

        this.chatBox.appendChild(this.description)
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

    addDocumentEventListeners()
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
            // Avoid submitting while Enter is being used to compose text.
            // Input Method Editors (IMEs) are commonly used for languages
            // such as Japanese and Chinese.
            if (event.key === 'Enter' && !event.isComposing)
            {
                const message = this.inputField.value.trim()

                if (!message)
                    return

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

        // Scroll the chatbox to the latest message.
        this.chatBox.scrollTop = this.chatBox.scrollHeight

        this.requestAnswer(question)
    }

    // Request an answer from the backend using the Fetch API.
    // The method is async so it can await fetch() and response.json().
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    async requestAnswer(question)
    {
        this.inputField.disabled = true

        const llmAnswer = this.prepareAnswer()

        try
        {
            // fetch() resolves when the response status and headers are available.
            // POST sends the question and recent history in the request body.
            // Content-Type tells the backend that the body contains JSON.
            // JSON.stringify() serializes the JavaScript object into JSON text.
            const serverResponse = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pointIndex: this.pointIndex,
                    question: question,

                    // Send only the two latest completed exchanges
                    // to limit the history included in the input tokens.
                    chatHistory: this.chatHistory.slice(-2)
                })
            })

            // This handles Vercel's rate limiting
            if (serverResponse.status === 429)
            {
                this.answerQuestion(
                    llmAnswer,
                    'Too many questions. Please wait a moment.'
                )

                this.inputField.value = question
                return
            }

            // response.ok is true for HTTP status codes from 200 through 299.
            if (!serverResponse.ok)
            {
                throw new Error(`Response status: ${serverResponse.status}`)
            }

            // json() belongs to the Fetch API's Response object.
            // It reads the response body to completion and parses its JSON text.
            const llmServerResponse = await serverResponse.json()

            this.answerQuestion(llmAnswer, llmServerResponse.answer, question)
        }
        catch (error)
        {
            console.error(error.message)

            this.answerQuestion(llmAnswer, 'Try again later.')
        }
    }

    prepareAnswer()
    {
        const llmAnswer = document.createElement('div')
        llmAnswer.classList.add('llmAnswer', 'waiting')
        llmAnswer.textContent = 'Waiting answer...'

        this.chatBox.appendChild(llmAnswer)
        this.chatBox.scrollTop = this.chatBox.scrollHeight

        return llmAnswer
    }

    answerQuestion(llmAnswer, answer, question = null)
    {
        llmAnswer.classList.remove('waiting')

        llmAnswer.textContent = answer

        this.inputField.disabled = false
        this.chatBox.scrollTop = this.chatBox.scrollHeight

        if (question)
        {
            this.chatHistory.push({
                question: question,
                answer: answer
            })
        }

        if (this.active)
        {
            this.inputField.focus()
        }
    }

    calculateScreenCoordinates()
    {
        this.screenCoordinates.copy(this.coordinates)
        this.screenCoordinates.project(this.camera.instance)
    }

    castRay()
    {
        this.rayCaster.setFromCamera(
            this.screenCoordinates,
            this.camera.instance
        )

        this.intersects = this.rayCaster.intersectObject(
            this.heritage.collider,
            true
        )
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
            const pointDistance = this.coordinates.distanceTo(
                this.camera.instance.position
            )

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

    addCameraEventListeners()
    {
        this.needsPlacement = true

        this.camera.controls.addEventListener('change', () =>
        {
            this.needsPlacement = true
        })
    }

    placePointOfInterest()
    {
        this.camera.instance.updateWorldMatrix(true, false)
        this.heritage.collider.updateWorldMatrix(true, true)

        this.calculateScreenCoordinates()
        this.castRay()
        this.togglePointVisibility()
        this.move()
    }

    update()
    {
        if (!this.needsPlacement)
            return

        this.placePointOfInterest()
        this.needsPlacement = false
    }

    resize()
    {
        this.placePointOfInterest()
    }

    deactivate()
    {
        this.active = false

        this.pointOfInterest.classList.remove('active')
        this.chatBox.classList.remove('visible')
        this.inputField.classList.remove('visible')
    }
}
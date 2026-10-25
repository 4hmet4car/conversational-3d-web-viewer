import { GoogleGenAI } from "@google/genai"

function verifyPostMethod(request, response, next)
{
    // 405 is the "Method Not Allowed" client error response status code.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/405
    // Check whether the request uses POST; return if it does not.
    if (request.method !== 'POST')
    {
        response.setHeader('Content-Type', 'application/json')
        response.statusCode = 405

        // A 405 response must include an Allow header
        // listing the supported HTTP methods.
        response.setHeader('Allow', 'POST')
        response.end(JSON.stringify({ error: 'Use POST' }))

        return
    }

    next() // Call the next middleware in the chain.
}

function parseRequestBody(request, response, next)
{
    response.setHeader('Content-Type', 'application/json')

    // This accounts for vercel deployment
    // Vercel parses json already in body property for us
    // So if this property if found in the request object
    // we know that this is a deployment not development
    if ('body' in request)
    {
        try
        {
            request.parsedBody = request.body
        }
        catch (error)
        {
            response.statusCode = 400
            response.end(JSON.stringify({ error: 'Invalid JSON' }))
            return
        }

        if (request.parsedBody === undefined)
        {
            response.statusCode = 400
            response.end(JSON.stringify({ error: 'Request body is missing' }))
            return
        }

        next()
        return // Skip the local stream-reading code below.
    }

    // Stop processing incoming data if the request body is too large.
    let rejectData = false

    // Create an empty string to collect the request body.
    let body = ''

    // By default, Node.js delivers request chunks as Buffers.
    // Decode the incoming bytes as UTF-8 so that each chunk is a string.
    request.setEncoding('utf8')

    // Node.js calls this callback whenever another chunk of the body arrives.
    request.on('data', (chunk) =>
    {
        if (rejectData)
            return

        body += chunk

        // Check whether the request body exceeds the chosen byte limit.
        // The 2000-byte limit is arbitrary and applies to the entire JSON body.
        if (Buffer.byteLength(body) > 2000)
        {
            rejectData = true
            body = ''

            response.statusCode = 413
            response.end(JSON.stringify({ error: 'Request too large' }))
        }
    })

    // Node.js calls this callback when the entire request body has been read.
    request.on('end', () =>
    {
        if (rejectData)
            return

        try
        {
            request.parsedBody = JSON.parse(body)
        }
        catch (err)
        {
            response.statusCode = 400
            response.end(JSON.stringify({ error: 'Invalid JSON' }))

            return // Exit this callback without calling next().
        }

        next()
    })

    request.on('error', (error) =>
    {
        console.error('Request error:', error)

        rejectData = true
        body = ''

        // This checks whether sending an error response is still possible
        // response.writableEnded is true when response.end() has already been called
        // response.destroyed is true when The response stream has been destroyed and cannot be used
        // response.destroyed is true for example when the visitor closes the tab or loses their connection while sending the question
        if (!response.writableEnded && !response.destroyed)
        {
            response.statusCode = 400
            response.end(JSON.stringify({ error: 'Could not read the request' }))
        }
    })
}

function validateParsedData(request, response, next)
{
    response.setHeader('Content-Type', 'application/json')

    if (
        request.parsedBody === null ||
        typeof request.parsedBody.question !== 'string' ||
        !request.parsedBody.question.trim() ||
        request.parsedBody.question.length > 500
    )
    {
        response.statusCode = 400
        response.end(JSON.stringify({ error: 'Question must contain 1-500 characters' }))
        return
    }

    next()
}

async function simplyRespond(request, response)
{
    // response is the Node.js HTTP response object.
    // Tell the client that the response body contains JSON.
    response.setHeader('Content-Type', 'application/json')

    try
    {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })

        const result = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: request.parsedBody.question
        })

        const answer = result.text

        if (typeof answer !== 'string' || !answer.trim())
        {
            response.statusCode = 502
            response.end(JSON.stringify({
                error: 'Gemini did not return a text answer'
            }))
            return
        }

        // Send the JSON text and mark the response as complete.
        response.end(JSON.stringify({ answer: answer }))
    }
    catch (error)
    {
        console.error('Gemini request failed:', error)

        response.statusCode = 502
        response.end(JSON.stringify({ error: 'Could not get an answer from Gemini' }))
    }
}


// Vercel’s file-routing convention tells it: Requests to /api/chat should invoke the default export from api/chat.js
export default function handleChat(request, response)
{
    verifyPostMethod(request, response, () =>
    {
        parseRequestBody(request, response, () =>
        {
            validateParsedData(request, response, () =>
            {
                simplyRespond(request, response)
            })
        })
    })
}
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

function simplyRespond(request, response)
{
    // response is the Node.js HTTP response object.
    // Tell the client that the response body contains JSON.
    response.setHeader('Content-Type', 'application/json')

    // Send the JSON text and mark the response as complete.
    response.end(JSON.stringify({ answer: 'You asked: ' + request.parsedBody.question }))
}

// Export the plugin function for use in vite.config.js.
export default function simpleBackend()
{
    return {
        name: 'simpleBackend',

        // configureServer is a predefined Vite hook for configuring the development server.
        // https://vite.dev/guide/api-plugin#configureserver
        configureServer(server) // Vite passes its server object here.
        {
            // Register middleware for requests under /api/chat.
            // Each middleware runs in registration order when the preceding one calls next().

            // server.middlewares is Vite's Connect-based request-handling application.
            server.middlewares.use('/api/chat', verifyPostMethod)
            server.middlewares.use('/api/chat', parseRequestBody)
            server.middlewares.use('/api/chat', validateParsedData)
            server.middlewares.use('/api/chat', simplyRespond)
        }
    }
}
function simpleRequestHandler(reuqest, response, next)
{
    response.setHeader('Content-Type', 'application/json')

    // response.end signals that all response headers and body text have been sent
    response.end(JSON.stringify({
        answer: 'Dev backend active'
    }))
}

export default function simpleBackend()
{
    return {
        name: 'simpleBackend',
        // 'configureServer' is a predefined vite hook for server config
        // https://vite.dev/guide/api-plugin?utm_source=chatgpt.com#configureserver
        configureServer(server) // You supply the server as a parameter
        {
            // Here you hook the middleswares object with your custom end point
            // That is when the client makes a request to this end point, the backend runs the 'simpleRequestHandler'
            server.middlewares.use('/api/chat', simpleRequestHandler)  //server.middlewares is vite’s request-handling application
        }
    }
}
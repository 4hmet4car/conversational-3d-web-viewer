import handleChat from "../api/chat.js"

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
            server.middlewares.use('/api/chat', handleChat)
        }
    }
}
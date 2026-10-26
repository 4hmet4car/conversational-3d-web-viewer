# Conversational 3D Web Viewer

A browser-based Three.js experience for exploring a cultural heritage object through **3D-linked points of interest (POIs)** and **context-aware, AI-generated answers**.

**Live project:** https://conversational-3d-web-viewer.vercel.app/

## Current case study

Version **1.1.0** presents a 3D interpretation of **the Nile sculpture**, a colossal personification of the Nile River displayed at the Vatican Museums. Six numbered points highlight the reclining figure, sixteen children, cornucopia, grain, sphinx, and Nilotic scenes on the base.

Visitors can orbit the model, open a numbered point, read its introductory description, and ask follow-up questions about that detail. Answers use repository-maintained object/POI reference texts sent to Gemini as context. The previous `main` version used a Columbarium case study.

## Features

- Three.js 3D model viewer with `OrbitControls`.
- Six HTML point-of-interest anchors projected from 3D positions into screen space.
- Occlusion handling using a separate invisible collider mesh and Three.js `Raycaster`.
- Only one POI panel is open at a time; anchor placement updates after camera movements and window resizing.
- Text-based questions submitted to a server endpoint, with per-POI in-memory conversation history.
- Server-side Gemini API integration, with curated historical context and instructions to preserve factual uncertainty.
- Waiting and error states, including rate-limit-specific feedback.
- GLSL-based loading overlay and loading-progress presentation.
- Optional developer GUI and FPS monitoring via `#debug`.

## Technologies

- **Frontend:** JavaScript (ES modules), Three.js `^0.185.1`, HTML, CSS, GLSL.
- **Build / development:** Vite `^7.3.6`, `vite-plugin-glsl`, `vite-plugin-restart`.
- **AI backend:** `@google/genai` `^2.31.0`, a JavaScript API handler in `api/chat.js`.
- **Development utilities:** `lil-gui`, `stats.js`.
- **Assets:** GLB models loaded with DRACO support.
- **Deployment design:** Vite static frontend and Vercel-style serverless API routing.

## Local installation

**Requirements:** a compatible Node.js/npm installation and a Google Gemini API key with access to the configured model.

```bash
git clone https://github.com/4hmet4car/conversational-3d-web-viewer.git
cd conversational-3d-web-viewer
npm install
```

Create a `.env` file **in the repository root**:

```dotenv
GEMINI_API_KEY=your_api_key_here
```

Do not commit this file or expose the API key in frontend code. The Vite configuration uses `envDir: '../'` relative to its `src/` root, and `dev/simpleBackend.js` loads variables starting with `GEMINI_` on the server side.

Start the development server:

```bash
npm run dev
```

Vite prints the local URL. The development plugin makes `/api/chat` available through the same server.

Build the frontend:

```bash
npm run build
```

Build output is written to `dist/`. The package does **not** define an `npm run preview` script. A static build alone does not provide the chat API; this requires a compatible serverless/runtime deployment and `GEMINI_API_KEY` configuration.

## Deployment

The project is designed for Vercel-style deployment:

1. Connect the repository to Vercel.
2. Configure the build command as `npm run build` and output directory as `dist` where necessary.
3. Add `GEMINI_API_KEY` as a server-side environment variable in the project settings.
4. Ensure the root-level `api/chat.js` is deployed as an API function and reachable at `/api/chat`.

The project archives do **not** contain a `vercel.json`, so verify build/output settings and function behavior in the actual hosting project. Avoid treating the Vite development middleware as production API hosting.

## How conversation requests work

The browser sends a request to `POST /api/chat`:

```json
{
  "pointIndex": 2,
  "question": "What do the children symbolize?",
  "chatHistory": [
    {
      "question": "Why are there sixteen?",
      "answer": "They symbolize sixteen cubits of Nile floodwater."
    }
  ]
}
```

On success, the API returns JSON containing `answer`:

```json
{ "answer": "They represent sixteen cubits of rising floodwater." }
```

The backend validates input, identifies the requested POI, then assembles instructions from:

- `src/data/systemInstructions.js` — conversational boundaries, factual accuracy, answer style, and language guidance.
- `src/data/heritageReference.js` — whole-object cultural heritage context.
- `src/data/pointsReferences.js` — POI descriptions, historical references, and 3D coordinates.

It sends these strings, the latest question, and up to **two previous completed exchanges** to the Gemini model. The configured model ID in `api/chat.js` is **`gemini-3.5-flash-lite`**; verify availability for your API account before deploying.

**Input constraints:** POST only; maximum JSON request body **16 KiB**; question **1–500 characters**; up to **two exchanges** of chat history; each history answer up to **4,000 characters**. Requests with unknown POI indices are rejected.

The content is **curated in source files**, not obtained from an external retrieval index or vector database. Model responses may still be incorrect despite those instructions.

## Project layout

```text
.
├── api/
│   └── chat.js                    # Gemini-backed POST endpoint
├── dev/
│   └── simpleBackend.js           # Local Vite middleware for /api/chat
├── src/
│   ├── index.html
│   ├── script.js                  # Frontend entry point
│   ├── data/
│   │   ├── heritageReference.js   # Whole-object source information
│   │   ├── pointsReferences.js    # Six POIs: position, text, reference
│   │   └── systemInstructions.js  # AI response constraints
│   ├── Experience/
│   │   ├── Experience.js          # Main application coordinator
│   │   ├── Camera.js
│   │   ├── Renderer.js
│   │   ├── C3DWV/
│   │   │   ├── C3DWV.js
│   │   │   ├── Heritage.js
│   │   │   ├── Environment.js
│   │   │   └── PointOfInterest/
│   │   │       ├── POIManager.js
│   │   │       └── PointOfInterest.js
│   │   ├── Splash/               # Loading overlay, bar and shaders
│   │   ├── PostProcessing/       # Present, but not initialized by default
│   │   └── Utils/                # Resource loading, debug, time, stats
│   └── style/                    # Modular global, POI and chat CSS
├── static/
│   └── models/
│       ├── nile.glb
│       └── nileCollider.glb
├── vite.config.js
├── package.json
└── CHANGELOG.md
```

## Architectural notes

**Model and collider:** the visible object is loaded from `nile.glb`; `nileCollider.glb` is attached as an invisible mesh. The viewer uses the collider to determine whether a POI is hidden behind the sculpture.

**POIs and text:** change the points, coordinates, introductions, and reference descriptions in `src/data/pointsReferences.js`. Their coordinates must match the currently displayed 3D model and framing.

**Conversations:** each POI keeps its own history in the page's JavaScript memory. History is not written to persistent storage. Only two completed exchanges are sent with each question to constrain context size.

**Rendering:** the application currently renders through `Renderer.js`. Postprocessing source modules are included, but `Experience.js` comments out their initialization and update methods. The environment setup is similarly not enabled in `C3DWV.js`.

**Developer mode:** append `#debug` to the URL to activate available debug controls and a frame-rate panel.

## Current limitations

- No persistent conversation storage, account system, or independent retrieval/RAG infrastructure.
- Gemini availability, network access, API quotas, and credentials are needed for generated answers.
- Historical answers are constrained by local references, but there is no automatic external fact verification.
- The provided package does not declare a test command or automated tests; functionality should be manually verified after changes.
- The frontend includes rate-limit response handling, but that alone does not establish that a rate-limiting policy is configured in deployment.
- Some experimental modules (environment effects, postprocessing, cursor/raycast cursor) are present but not wired into the default app path.

## Release history

See [CHANGELOG.md](./CHANGELOG.md) for the comparison between the earlier Columbarium prototype and the v1.1 Nile / Gemini implementation.

## License

The package currently declares `"license": "UNLICENSED"`. Do not assume permission for redistribution or reuse of code or 3D assets without the appropriate authorization.
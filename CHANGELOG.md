# Changelog

Notable changes to the **Conversational 3D Web Viewer**. This document compares the provided `main` archive (earlier codebase) against the provided `v1.1` archive (newer codebase).

## [1.1.0] — Nile sculpture and contextual AI conversations

### Added
- **Server-side Gemini integration:** `api/chat.js` implements a `POST /api/chat` handler using `@google/genai` and the `GEMINI_API_KEY` environment variable. Its system prompt combines general guidance, whole-object reference information, and the selected point's description and reference.
- **Development API middleware:** `dev/simpleBackend.js` attaches the same chat handler to the Vite development server; production relies on Vercel's file-based `/api/chat` routing.
- **Request validation and error responses:** the API rejects unsupported methods, malformed or oversized JSON (16 KiB maximum), invalid or oversized questions (1–500 characters), unknown POI indices, and invalid conversation history (up to two exchanges). Errors from Gemini return an HTTP 502 response.
- **Per-point chat UI:** a question input, message history, pending-answer display, response rendering, and retry/error text are implemented in `PointOfInterest.js`. A 429 response receives a specific rate-limit message. Questions are sent on Enter; input is disabled while awaiting a response.
- **Contextual reference data:** `src/data/heritageReference.js`, `pointsReferences.js`, and `systemInstructions.js` define an object-level historical reference, six individually annotated points of interest, and answer-style/accuracy constraints.
- **New 3D model assets:** `static/models/nile.glb` and `nileCollider.glb`. The separate, non-visible collider is used for point-of-interest occlusion checks.
- **Modular POI system:** `POIManager.js` creates and coordinates six anchored POIs, maintains a single active panel, projects 3D coordinates to screen positions, and checks visibility using raycasting. Placement updates on orbit-control changes and resizing.
- **Animated loading UI:** dedicated `Splash`, `LoadingBar`, and `Overlay` modules, with GLSL shaders and progress updates tied to loaded resources.
- **Performance/debugging utility:** optional `stats.js` FPS panel, activated by a `#debug` URL fragment.
- **Postprocessing implementation files:** composer/passes and custom displacement/tint shaders are present for experimentation, **but the application does not instantiate postprocessing by default**.
- **Modular stylesheets:** separate CSS files for global styles, variables, the canvas, POI anchors, conversation elements, and inputs.

### Changed
- **Case study:** the original frescoed Columbarium assets and scene have been replaced with the Nile sculpture, a cultural heritage object displayed in the Vatican Museums. This is a change of content and experience, not just an incremental UI improvement.
- **Architecture:** the previous `Experience/World/` implementation is replaced by `Experience/C3DWV/` and a dedicated point-of-interest subsystem. `Experience.js` now coordinates the new world, loading presentation, and stats utility.
- **Camera and rendering configuration:** camera framing, orbit target/limits, and rendering parameters have been adjusted for the Nile model.
- **Material handling:** loaded heritage meshes using `MeshStandardMaterial` are converted to textured `MeshBasicMaterial` in the newer heritage module.
- **Development tooling:** Vite configuration now installs the local backend plugin; dependencies include Google Gen AI SDK and `stats.js`. The package identifies itself as version `1.1.0`.
- **Page styling and markup:** `src/index.html` now loads `src/style/index.css` instead of the earlier monolithic stylesheet.

### Removed / replaced
- Columbarium GLB scene parts, associated diffuse/normal/ARM textures, earlier world shader injections, and the single `src/style.css` file.
- The previous monolithic `Splash.js`, replaced by the loading/splash directory.
- The earlier `World/` module structure and its heritage/environment files, replaced by the new `C3DWV/` equivalents.
- The earlier Archivo variable font asset from the provided archive.

### Notes and limitations
- **Not a full retrieval-augmented generation (RAG) pipeline:** the Gemini request uses in-repository reference strings and recent chat history. No document retrieval service or vector database is implemented in these files.
- **Recent-history scope:** the frontend sends up to the last two completed Q&A exchanges, and the backend accepts at most two. Each POI stores its own conversation history in memory; this is not persistent storage.
- **Default rendering path:** `Experience.js` leaves cursor/ray cursor and `PostProcessing` initialization commented out. The `Environment` component is also commented out in `C3DWV.js`.
- **Model availability:** the model ID specified by the API is `gemini-3.5-flash-lite`. Successful responses require that this ID be available to the configured Gemini account/API.

## [1.0.0] — Earlier Columbarium prototype (archive `main`)

- Earlier Three.js-based cultural heritage scene using multiple Columbarium model parts and texture maps.
- Scene organization under `src/Experience/World/`, with a single primary stylesheet and earlier splash implementation.
- No corresponding `api/chat.js` Gemini backend or the new modular chat/POI subsystem appears in this earlier archive.
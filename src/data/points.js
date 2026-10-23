/**
 * This module exports the point of interests' information
 */
import { Vector3 } from "three"

export default [
    {
        index: 1,
        description: 'Front and top screen with HUD aggregating terrain and battle informations.',
        coordinates: new Vector3(1.55, 0.3, - 0.6),
    },
    {
        index: 2,
        description: 'Ventilation with air purifier and detection of environment toxicity.',
        coordinates: new Vector3(0.5, 0.8, - 1.6),
    },
    {
        index: 3,
        description: 'Cameras supporting night vision and heat vision with automatic adjustment.',
        coordinates: new Vector3(1.6, - 1.3, - 0.7),
    },
]
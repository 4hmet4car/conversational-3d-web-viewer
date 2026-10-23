import { Raycaster } from 'three'
import PointOfInterest from './PointOfInterest.js'

import points from '../../../data/points.js'

export default class PointsOfInterest
{
    constructor()
    {
        this.rayCaster = new Raycaster()

        this.initPoints()
        this.setEventListeners()
    }

    initPoints()
    {
        this.pointsOfInterest = []

        for (const point of points)
        {
            const pointOfInterest = new PointOfInterest(
                point.index,
                point.description,
                point.coordinates,
                this.rayCaster
            )
            this.pointsOfInterest.push(pointOfInterest)
        }
    }

    setEventListeners()
    {
        for (const pointOfInterest of this.pointsOfInterest)
        {
            pointOfInterest.on('clicked', () =>
            {
                this.deactivateOtherPoints(pointOfInterest)
            })
        }
    }

    deactivateOtherPoints(clickedPoint)
    {
        for (const pointOfInterest of this.pointsOfInterest)
        {
            if (pointOfInterest !== clickedPoint && pointOfInterest.active)
            {
                pointOfInterest.deactivate()
            }
        }
    }

    update()
    {
        for (const pointOfInterest of this.pointsOfInterest)
        {
            pointOfInterest.update()
        }
    }
}
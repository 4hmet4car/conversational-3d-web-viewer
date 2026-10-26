import { Raycaster } from 'three'
import PointOfInterest from './PointOfInterest.js'

import pointsReferences from '../../../data/pointsReferences.js'

export default class PointsOfInterest
{
    constructor(heritage)
    {
        this.rayCaster = new Raycaster()
        this.heritage = heritage

        this.initPoints()
        this.setEventListeners()
    }

    initPoints()
    {
        this.pointsOfInterest = []

        for (const point of pointsReferences)
        {
            const pointOfInterest = new PointOfInterest(
                point.index,
                point.description,
                point.coordinates,
                this.rayCaster,
                this.heritage
                
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

    resize()
    {
        for (const pointOfInterest of this.pointsOfInterest)
        {
            pointOfInterest.resize()
        }
    }
}
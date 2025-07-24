import { KeyPoint } from "./keyPoint.model.js"
import { TourRating } from "./tourRating.model.js"

export interface TourFormData {
    id?: number,
    name: string,
    description: string,
    dateTime?: string,
    maxGuests: number,
    status?: string,
    guideId: number,
    keyPoints?: KeyPoint[],
    ratings?: TourRating[]
}
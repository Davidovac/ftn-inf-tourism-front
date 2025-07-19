import { User } from "../../users/model/user.model.js"
import { KeyPoint } from "./keyPoint.model.js"
import { TourRating } from "./tourRating.model.js"

export class Tour {
    public id?: number
    public name: string
    public description: string
    public dateTime: string
    public maxGuests: number
    public status?: string
    public guide?: User
    public guideId: number
    public keyPoints: KeyPoint[]
    public ratings: TourRating[]

    constructor(id, name, description, dateTime, maxGuests, status, guide, guideId, keyPoints, ratings){
        this.id = id
        this.name = name
        this.description = description
        this.dateTime = dateTime
        this.maxGuests = maxGuests
        this.status = status
        this.guide = guide
        this.guideId = guideId
        this.keyPoints = keyPoints
        this.ratings = ratings
    }
}
import { Tour } from "./tour.model"

export class Reservation {
    public id: number
    public guestsCount: number
    public userId: number
    public tourId: number
    public tour: Tour

    constructor(id, guestsCount, userId, tourId, tour) {
        this.id = id
        this.guestsCount = guestsCount
        this.userId = userId
        this.tourId = tourId
        this.tour = tour
    }
}
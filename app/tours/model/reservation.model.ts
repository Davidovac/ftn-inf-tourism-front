import { User } from "../../users/model/user.model.js"
import { Tour } from "./tour.model.js"

export class Reservation {
    public id: number
    public guestsCount: number
    public user?: User
    public userId: number
    public tour: Tour
    public tourId: number

    constructor(id, guestsCount, user, userId, tour, tourId) {
        this.id = id
        this.guestsCount = guestsCount
        this.user = user
        this.userId = userId
        this.tour = tour
        this.tourId = tourId
    }
}
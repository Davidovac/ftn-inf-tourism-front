import { User } from "../../users/model/user.model.js"

export class TourRating {
    public id: number
    public userId: number
    public user?: User
    public tourId: number
    public rating: number
    public comment?: string
    public createdAt: Date

    constructor(id, userId, user, tourId, rating, comment, createdAt) {
        this.id = id
        this.userId = userId
        this.tourId = tourId
        this.user = user
        this.rating = rating
        this.comment = comment
        this.createdAt = createdAt
    }
}
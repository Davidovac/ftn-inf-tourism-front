import { User } from "../../users/model/user.model.js"

export interface TourRatingData {
    id?: number,
    userId: number,
    user?: User,
    tourId: number,
    rating: number,
    comment?: string
}
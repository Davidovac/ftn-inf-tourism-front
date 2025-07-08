export class Reservation {
    public id: number
    public guestsCount: number
    public userId: number
    public tourId: number

    constructor(id, guestsCount, userId, tourId) {
        this.id = id
        this.guestsCount = guestsCount
        this.userId = userId
        this.tourId = tourId
    }
}
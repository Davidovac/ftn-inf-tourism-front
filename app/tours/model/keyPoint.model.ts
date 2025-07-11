export class KeyPoint {
    public id: number
    public order: number
    public name: string
    public description: string
    public imageUrl: string
    public latitude: number
    public longitude: number

    constructor(id, order, name, description, imageUrl, latitude, longitute) {
        this.id = id
        this.order = order
        this.name = name
        this.description = description
        this.imageUrl = imageUrl
        this.latitude = latitude
        this.longitude = longitute
    }
}
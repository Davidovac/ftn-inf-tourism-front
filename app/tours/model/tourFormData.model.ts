export interface TourFormData {
    name: string,
    description: string,
    dateTime: string,
    maxGuests: number,
    status?: string,
    guideId: number
}
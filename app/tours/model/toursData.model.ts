import { Tour } from "./tour.model.js"

export interface ToursData {
    data: Tour[],
    totalCount: number
}
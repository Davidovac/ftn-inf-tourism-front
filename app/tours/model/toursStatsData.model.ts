import { TourStat } from "./tourStat.model.js";
export interface ToursStatsData {
    mostReserved: TourStat[],
    leastReserved: TourStat[],
    mostFilled: TourStat[],
    leastFilled: TourStat[]
}
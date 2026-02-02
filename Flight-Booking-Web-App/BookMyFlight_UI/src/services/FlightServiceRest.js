import api from "./api";

/**
 * 
 * Standardized Flight Service using central api instance
 */
export default class FlightServiceRest {
    constructor() {
        this.base = "/flight";
    }

    // Service method to fetch all flights
    async getFlights() {
        return await api.get(this.base + "/fetchall").then(response => {
            return response.data;
        }).catch(error => {
            console.log("Error : " + error.message);
            throw error;
        });
    }

    // Service method to Add a new flight in the database
    async saveFlight(flight) {
        return await api.post(this.base + "/add", flight).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            throw error;
        });
    }

    // Service method to make changes in an existing flight
    async updateFlight(flight) {
        return await api.put(this.base + "/update", flight).then(response => {
            return response.data;
        }).catch(error => {
            console.log("Error : " + error.message);
            throw error;
        });
    }

    // Service method to remove flight from database
    async deleteFlight(fid) {
        return await api.delete(this.base + "/remove/" + fid).then(response => {
            return response.data;
        }).catch(error => {
            console.log("Error : " + error.message);
            throw error;
        });
    }

    // Service method to fetch flights on source, Destination and Date
    async getFlightsForUser(source, destination, date) {
        return await api.get(this.base + "/fetch", {
            params: { source, destination, date }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log("Error : " + error.message);
            throw error;
        });
    }

    // Service method to toggle flight status (active/inactive)
    async updateFlightStatus(fid, status) {
        return await api.put(this.base + "/status/" + fid + "/" + status).then(response => {
            return response.data;
        }).catch(error => {
            console.log("Error : " + error.message);
            throw error;
        });
    }
}
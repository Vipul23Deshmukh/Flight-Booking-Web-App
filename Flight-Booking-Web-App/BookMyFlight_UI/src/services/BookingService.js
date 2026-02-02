import api from "./api"

/**
 * 
 * Using central api instance with JWT support
 * The service method handles operations for booking, ticket and passengers
 */
export default class BookingService {
    constructor() {
        this.base = "/book";
    }

    // Service method to add booking 
    async addBooking(numberOfSeatsToBook, flightNumber, source, destination, date) {
        return await api.post(this.base + "/booking", { numberOfSeatsToBook },
            { params: { "fid": flightNumber, "source": source, "destination": destination, "date": date } }).then(response => {
                console.log(response.data)
                if (typeof response.data === 'string' && response.data.length > 5) {
                    alert(response.data)
                    return response
                } else {
                    localStorage.setItem("bid", parseInt(response.data))
                    return response
                }
            })
    }

    // Service method to add passengers
    async addPassengers(pass1) {
        return await api.post(this.base + "/passenger/" + localStorage.getItem("bid"), pass1).then(response => {
            console.log(response.data)
        })
    }

    // Service method to generate ticket 
    async generateTicket(ticket) {
        const user = JSON.parse(localStorage.getItem("user"));
        const uid = user ? user.userId : 0;
        return await api.post(this.base + "/ticket/" + uid + "/" + localStorage.getItem("bid") + "/1", ticket)
            .then(response => {
                console.log(response.data)
                localStorage.setItem("ticket", JSON.stringify(response.data))
                return response;
            })
    }

    // Service method to fetch tickets based on userid
    async getTickets() {
        const user = JSON.parse(localStorage.getItem("user"));
        const uid = user ? user.userId : 0;
        return await api.get(this.base + "/getTickets/" + uid)
            .then(response => {
                console.log(response.data)
                return response;
            })
    }

    // Service method to fetch ticket by booking id
    async getTicketByBookingId(bid) {
        return await api.get(this.base + "/getTicketByBooking/" + bid)
            .then(response => {
                console.log("Fetched ticket by bid:", response.data);
                return response;
            });
    }

    // Admin: Fetch all bookings
    async getAdminAllBookings() {
        return await api.get(this.base + "/admin/allbookings").then(response => {
            return response;
        });
    }
}

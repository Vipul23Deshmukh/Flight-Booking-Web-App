import api from "./api";

/**
 * 
 * Standardized User Service using central api instance
 */
export default class UserService {

    constructor() {
        this.base = ""; // UserController methods are mostly root or custom paths
    }

    // Service method to register new user
    async addUser(user) {
        return await api.post("/createuser", user).then(response => {
            return response;
        });
    }

    // Service method to validate user details for authentication using JWT
    async validateUser(username, password) {
        return await api.post("/auth/login", {
            username: username,
            password: password
        });
    }

    // Admin: Fetch all registered users
    async getAdminAllUsers() {
        return await api.get("/admin/users").then(response => {
            return response;
        });
    }
}
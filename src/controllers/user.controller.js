import { logger } from "../utils/logger.js";

class UserController {
    async renderDashboard(req, res) {
        try{
            const user = req.session.user || req.session
            return res.status(200).render("dashboard", { user })
        } catch (error) {
            logger.error("Error ejecutando el dashboard: " + error);
            return res.status(500).render("errorPage", { msg: "Internal Server Error" });
        }
    }
}

export const userController = new UserController();
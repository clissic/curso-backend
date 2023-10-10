import { logger } from "../utils/logger.js";

class UserController {
    async renderDashboard(req, res) {
        try{
            const user = req.session || res.session.user
            return res.status(200).render("dashboard", { user })
        } catch (e) {
            logger.error("Error no se donde");
            return res.status(500).render("errorPage", { msg: "Internal Server Error" });
        }
    }
}

export const userController = new UserController();
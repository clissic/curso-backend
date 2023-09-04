import { logger } from "../utils/logger.js";

export function checkLogin(req, res, next) {
  if (req.session.user?.email || req.session?.email) {
    logger.info("Is loged");
    return next();
  } else {
    logger.info("Is not loged");
    return res.redirect("/");
  }
}

export function checkAdmin(req, res, next) {
  if (req.session.user?.role === "admin" || req.session?.role === "admin") {
    return next();
  }
  return res.status(403).render("errorPage", { msg: "Authorization error, your role is not admin." });
}

export function checkUser(req, res, next) {
  logger.info("Is logged as: " + JSON.stringify(req.session))
  if (req.session.user?.role == "user" || req.session.role == "user") {
    return next();
  }
  return res.status(403).render("errorPage", { msg: "Authorization error, your role is not user." });
}

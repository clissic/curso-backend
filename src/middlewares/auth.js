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
  logger.info("Is logged as admin user: " + JSON.stringify(req.session.user?.email || req.session.email))
  if (req.session.user?.role == "admin" || req.session?.role == "admin") {
    return next();
  }
  return res.status(403).render("errorPage", { msg: "Authorization error, your role is not admin." });
}

export function checkUser(req, res, next) {
  logger.info("Is logged as: " + JSON.stringify(req.session.user?.email || req.session.email))
  if (req.session.user?.role == "user") {
    return next();
  } else if (req.session.role == "user") {
    return next();
  }
  return res.status(403).render("errorPage", { msg: "Authorization error, your role is not user." });
}

export function checkPremium(req, res, next) {
  logger.info("Is logged as premium user: " + JSON.stringify(req.session.user?.email || req.session.email))
  if (req.session.user?.role == "premium" || req.session.role == "premium") {
    return next();
  }
  return res.status(403).render("errorPage", { msg: "Authorization error, your role is not premium."})
}

export function checkAdminOrPremium(req, res, next) {
  logger.info(JSON.stringify(req.session.user?.email || req.session.email) + " is logged as : " + JSON.stringify(req.session.user?.role || req.session.role))
  if (req.session.user?.role == "admin" || req.session.role == "admin" || req.session.user?.role == "premium" || req.session.role == "premium") {
    return next()
  }
  return res.status(403).render("errorPage", { msg: "Authorization error, your role is not admin or premium."})
}
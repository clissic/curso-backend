import express from "express";
import passport from "passport";
import { checkLogin } from "../middlewares/auth.js";

export const sessionsRouter = express.Router();

sessionsRouter.post("/signup", passport.authenticate('register', { failureRedirect: '/error-auth' }), async (req, res) => {
  if (!req.user) {
    return res.render("errorPage", { msg: "Something went wrong."})
  }
  req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, role: req.user.role, cartId: req.user.cartId}

  return res.redirect("/")
});

sessionsRouter.post("/login", passport.authenticate('login', { failureRedirect: '/error-auth' }), async (req, res) => {
  try {
    if (!req.user) {
      return res.render("errorPage", { msg: 'User email or password are incorrect.' });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, role: req.user.role, cartId: req.user.cartId}
    return res.redirect("/products");
  } catch (err) {
    console.error(err);
    return res.status(500).render("errorPage",{ msg: 'Internal Server Error' });
  }
});

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.render("errorPage", { msg: "Logout error."})
    }
    res.redirect("/")
  })
})

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
  );

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/error-auth" }),
  (req, res) => {
    req.session.email = req.user.email;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.role = req.user.role;
    req.session.cartId = req.user.cartId;
    res.redirect("/products")
  }
);

sessionsRouter.get ("/current", checkLogin, (req, res) => {
  res.send(req.session.user || req.session)
})
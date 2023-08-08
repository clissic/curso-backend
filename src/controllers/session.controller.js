import UserDTO from "./DTO/sessions.dto.js";

class SessionsController {
  async signup(req, res) {
    if (!req.user) {
      return res.render("errorPage", { msg: "Something went wrong." });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
      cartId: req.user.cartId,
    };
    return res.redirect("/");
  }

  async login(req, res) {
    try {
      if (!req.user) {
        return res.render("errorPage", {
          msg: "User email or password are incorrect.",
        });
      }
      req.session.user = {
        _id: req.user._id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role,
        cartId: req.user.cartId,
      };
      return res.redirect("/products");
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .render("errorPage", { msg: "Internal Server Error" });
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.render("errorPage", { msg: "Logout error." });
      }
      res.redirect("/");
    });
  }

  githubCallback(req, res) {
    req.session.email = req.user.email;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.age = req.user.age;
    req.session.role = req.user.role;
    req.session.cartId = req.user.cartId;
    res.redirect("/products");
  }

  current(req, res) {
    const session = req.session.user || req.session;
    const userDTO = new UserDTO(session)
    res.send(userDTO);
  }
}

export const sessionsController = new SessionsController();

import { recoverTokensService } from "../services/tokens.service.js";
import { logger } from "../utils/logger.js";

class LoginController {
  loginRender(req, res) {
    return res.status(200).render("login", {});
  }

  recoverRender(req, res) {
    return res.status(200).render("recovery", {});
  }

  async recoverPass(req, res) {
    const { email, newPassword, confirmPassword } = req.body;
    try {
      if (newPassword === confirmPassword) {
        await recoverTokensService.recoverPass(email, newPassword);
        res.render("login", { msg: "Password updated!" });
      } else {
        res.render("recover-pass-form", {
          email,
          msg: "Your new password must match with the confirmation password.",
        });
      }
    } catch (error) {
      logger.error("Error recovering password in login.controller: " + error);
      res.render("errorPage", {
        msg: "Error recovering password in login.controller.",
      });
    }
  }

  async recoverForm(req, res) {
    const { token, email } = req.query;
    const foundToken = await recoverTokensService.findOne({ token, email });
    try {
        if (foundToken && foundToken.expire > Date.now()) {
            await recoverTokensService.findOne(token, email);
            res.render("recover-pass-form", { email: email });
        } else {
            res.render("errorPage", {
              msg: "Your token has expired or is invalid.",
            });
          }
    } catch (error) {
      logger.error("Error finding token in login.controller: " + error);
      res.render("errorPage", {
        msg: "Error finding token in login.controller.",
      });
    }
  }

  async recoverByEmail(req, res) {
    const { email } = req.body;
    try {
      await recoverTokensService.sendRecoveryToken(email);
      res.redirect("/");
    } catch (error) {
      logger.error("Error sending email in login.controller: " + error);
      res.render("errorPage", {
        msg: "Error sending email in login.controller.",
      });
    }
  }
}

export const loginController = new LoginController();

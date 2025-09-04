import express from "express";
import passport from "../passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET || "jwtsecret",
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:3000/oauth-redirect?token=${token}`);
  }
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET || "jwtsecret",
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:3000/oauth-redirect?token=${token}`);
  }
);

export default router;




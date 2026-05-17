const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const router = express.Router();

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

router.post(
  "/register",
  [
    body("fullName").trim().notEmpty().withMessage("Le nom complet est requis"),
    body("email").isEmail().withMessage("Email invalide"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caracteres")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Cet email existe deja" });
      }

      const user = await User.create({ fullName, email, password });
      const token = createToken(user._id);

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Le mot de passe est requis")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const passwordMatches = await user.comparePassword(password);

      if (!passwordMatches) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const token = createToken(user._id);

      return res.json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;

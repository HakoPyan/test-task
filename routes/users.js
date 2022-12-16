const express = require("express");
const router = express.Router();
const Auth = require("../auth/index");
const User = require("../models/user");

// Get my user
router.get("/:id", Auth.authentication, (req, res) => {
  res.json(req.user);
});

// Create a user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await Auth.hash(password);
    await new User({
      username,
      email,
      password: hashPassword,
    }).save();
    res.status(201).json({ message: "Successfully registered!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user
router.patch("/:id", Auth.authentication, async (req, res) => {
  try {
    if (req.body.email) {
      req.user.email = req.body.email;
      await req.user.save();
      res.status(200).json({ message: "User successfully updated!" });
    } else {
      res.status(400).json({ message: "Field cannot be updated!" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete("/:id", Auth.authentication, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ message: "User successfully deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await Auth.decode(password, user.password);
    if (result) {
      return await Auth.sign({ username, email: user.email });
    } else {
      throw Error("Wrong password.");
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

module.exports = router;

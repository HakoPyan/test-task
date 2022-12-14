const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get a user
router.get("/:id", (req, res) => {
  try {
    const user = User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).send({ message: "Not Found 404" });
  }
});

// Create a user
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  if (await User.findOne({ email })) {
    res.send({ message: "Email already exists!" });
  } else {
    const user = new User({
      username,
      email,
      password,
    });

    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
});

// Update a user
router.patch("/:id", (req, res) => {});

// Delete a user
router.delete("/:id", (req, res) => {});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a user
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// Create a user
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  if (await User.findOne({ email })) {
    res.json({ message: "Email already exists!" });
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
      res.status(400).json({ message: err.message });
    }
  }
});

// Update a user
router.patch("/:id", getUser, async (req, res) => {
  try {
    if (req.body.email) {
      res.user.email = req.body.email;
      const updatedUser = await res.user.save();
      res.status(200).json({ message: "User successfully updated!" });
    } else {
      res.status(400).json({ message: "Field cannot be updated!" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User successfully deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helping function
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Not Found 404" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;

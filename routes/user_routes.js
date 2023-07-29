const router = require("express").Router();
const { User } = require("../models");

// Route for creating a new user
router.post('/users', async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Route for getting all users
  router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Route for getting a single user by ID
  router.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: 'User not found' });
    }
  });

module.exports = router;

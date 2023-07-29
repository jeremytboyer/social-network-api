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

  // Route for updating a user by ID
router.put('/users/:id', async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Route for deleting a user by ID
  router.delete('/users/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Route for adding a new friend to a user's friend list
router.post('/users/:userId/friends/:friendId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
  
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the friend by friendId
      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ error: 'Friend not found' });
      }
  
      // Check if the friend is already in the user's friend list
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ error: 'Friend is already in the user\'s friend list' });
      }
  
      // Add the friend to the user's friend list
      user.friends.push(friendId);
      await user.save();
  
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Route for removing a friend from a user's friend list
  router.delete('/users/:userId/friends/:friendId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
  
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the friend is in the user's friend list
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ error: 'Friend is not in the user\'s friend list' });
      }
  
      // Remove the friend from the user's friend list
      user.friends = user.friends.filter(friend => friend.toString() !== friendId);
      await user.save();
  
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

module.exports = router;

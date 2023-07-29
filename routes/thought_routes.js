const router = require("express").Router();
const { Thought, User } = require("../models");

// Route to get all thoughts
router.get('/thoughts', async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Route to get a single thought by its _id
  router.get('/thoughts/:thoughtId', async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Route to create a new thought
  router.post('/thoughts', async (req, res) => {
    try {
      const { thoughtText, username, userId } = req.body;
      const newThought = await Thought.create({ thoughtText, username, userId });
  
      // Push the created thought's _id to the associated user's thoughts array field
    
      const user = await User.findById(userId);
      user.thoughts.push(newThought._id);
      await user.save();
  
      res.status(201).json(newThought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Route to update a thought by its _id
  router.put('/thoughts/:thoughtId', async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
      res.json(updatedThought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Route to remove a thought by its _id
  router.delete('/thoughts/:thoughtId', async (req, res) => {
    try {
      const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
  
      // Remove the thought's _id from the associated user's thoughts array field
      const user = await User.findById(deletedThought.userId);
      user.thoughts = user.thoughts.filter(thoughtId => thoughtId.toString() !== deletedThought._id.toString());
      await user.save();
  
      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Route to create a reaction stored in a single thought's reactions array field
  router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;
      const newReaction = req.body;
  
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
  
      thought.reactions.push(newReaction);
      await thought.save();
  
      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Route to pull and remove a reaction by the reaction's reactionId value
  router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.params.reactionId;
  
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
  
      thought.reactions = thought.reactions.filter(reaction => reaction.reactionId.toString() !== reactionId);
      await thought.save();
  
      res.json(thought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  })

module.exports = router;
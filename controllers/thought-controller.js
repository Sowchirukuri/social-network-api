const { Thought, User } = require('../models');

const thoughtController = {
  // GET: /api/thoughts - Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.status(500).json(err));
  },

  // GET: /api/thoughts/:id - Get a single thought by its _id
  getThoughtById(req, res) {
    const thoughtId = req.params.id;

    Thought.findOne({ _id: thoughtId })
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST: /api/thoughts - Create a new thought
  createThought(req, res) {
    const { thoughtText, username, userId } = req.body;

    Thought.create({ thoughtText, username })
      .then((thoughtData) => {
        return User.findOneAndUpdate(
          { _id: userId },
          { $push: { thoughts: thoughtData._id } },
          { new: true }
        );
      })
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  // PUT: /api/thoughts/:id - Update a thought by its _id
  updateThought(req, res) {
    const thoughtId = req.params.id;
    const { thoughtText } = req.body;

    Thought.findOneAndUpdate({ _id: thoughtId }, { thoughtText }, { new: true })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE: /api/thoughts/:id - Remove a thought by its _id
  deleteThought(req, res) {
    const thoughtId = req.params.id;

    Thought.findOneAndDelete({ _id: thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        return User.findOneAndUpdate(
          { username: thoughtData.username },
          { $pull: { thoughts: thoughtId } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought and associated reactions deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  // POST: /api/thoughts/:thoughtId/reactions - Create a reaction stored in a single thought's reactions array field
  createReaction(req, res) {
    const thoughtId = req.params.thoughtId;
    const { reactionBody, username } = req.body;

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE: /api/thoughts/:thoughtId/reactions - Remove a reaction by the reaction's reactionId value
  deleteReaction(req, res) {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.body.reactionId;

    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $pull: { reactions: { reactionId } } },
      { new: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;

const { User, Thought } = require('../models');

const userController = {
  // GET: /api/users - Get all users
  getAllUsers(req, res) {
    User.find({})
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  // GET: /api/users/:id - Get a single user by its _id and populated thought and friend data
  getUserById(req, res) {
    const userId = req.params.id;

    User.findOne({ _id: userId })
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST: /api/users - Create a new user
  createUser(req, res) {
    const { username, email } = req.body;

    User.create({ username, email })
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  // PUT: /api/users/:id - Update a user by its _id
  updateUser(req, res) {
    const userId = req.params.id;
    const { username, email } = req.body;

    User.findOneAndUpdate({ _id: userId }, { username, email }, { new: true })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE: /api/users/:id - Remove user by its _id
  deleteUser(req, res) {
    const userId = req.params.id;

    User.findOneAndDelete({ _id: userId })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Bonus: Remove a user's associated thoughts when deleted
        return Thought.deleteMany({ username: userData.username });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  // POST: /api/users/:userId/friends/:friendId - Add a new friend to a user's friend list
  addFriend(req, res) {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE: /api/users/:userId/friends/:friendId - Remove a friend from a user's friend list
  removeFriend(req, res) {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// INDEX – list all users (community page)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users/index', { users });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// SHOW – view a single user's pantry
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    res.render('users/show', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;

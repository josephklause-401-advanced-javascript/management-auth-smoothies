const router = require('express').Router();
const User = require('../models/user');

router
  .put('/favorites/:smoothieId', ({ user, params }, res, next) => {
    User.updateById(user.id, {
      $addToSet: {
        favorites: params.smoothieId
      }
    })
      .populate('favorites', 'name ingredients')
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  })

  .get('/favorites', ({ user }, res, next) => {
    User.findById(user.id)
      .populate('favorites', 'name')
      .lean()
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  })

  .delete('/favorites/:smoothieId', ({ user, params }, res, next) => {
    User.updateById(user.id, {
      $pull: {
        favorites: params.smoothieId
      }
    })
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  });

module.exports = router;
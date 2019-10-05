const router = require('express').Router({ mergeParams: true });
const User = require('../models/user');



router

  .put('/:id/roles/:role', ({ params }, res, next) => {
    User.updateById(params.id, {
      $addToSet: {
        roles: params.role
      }
    })
      .then(user => res.json(user))
      .catch(next);
  })

  .delete('/:id/roles/:role', ({ params }, res, next) => {
    User.updateById(params.id, {
      $pull: {
        roles: params.role
      }
    })
      .then(user => res.json(user))
      .catch(next);
  });

module.exports = router;
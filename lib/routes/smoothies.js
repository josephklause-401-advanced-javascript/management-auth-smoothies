const router = require('express').Router();
const Smoothie = require('../models/smoothie');

router

  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;
    Smoothie.create(req.body)
      .then(smoothie => res.json(smoothie))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Smoothie.find()
      .lean()
      .select('name ingredients')
      .then(smoothie => res.json(smoothie))
      .catch(next);
  })

  .put('/:id', ({ params, body, user }, res, next) => {
    Smoothie.updateOne({
      _id: params.id,
      owner: user.id
    }, body)
      .select('ingredients name')
      .then(smoothie => res.json(smoothie))
      .catch(next);
  })

  .delete('/:id', ({ params, user }, res, next) => {
    Smoothie.findOneAndRemove({
      _id: params.id,
      owner: user.id
    })
      .then(smoothie => res.json(smoothie))
      .catch(next);
  });
  
module.exports = router;
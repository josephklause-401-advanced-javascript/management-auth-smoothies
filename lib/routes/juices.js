const router = require('express').Router();
const Juice = require('../models/juice');
const ensureRole = require('../middleware/ensure-role');

router
  .post('/', ensureRole(), (req, res, next) => {
    Juice.create(req.body)
      .then(juice => res.json(juice))
      .catch(next);
  })

  .put('/:id', ensureRole(), ({ params, body }, res, next) => {
    Juice.updateOne({
      _id: params.id,
    }, body)
      .select('ingredients name')
      .then(juice => res.json(juice))
      .catch(next);
  })

  .delete('/:id', ensureRole(), ({ params }, res, next) =>{
    Juice.findByIdAndRemove(params.id)
      .then(juice => res.json(juice))
      .catch(next);
  })
  
  .get('/', (req, res, next) => {
    Juice.find()
      .lean()
      .select('name ingredients')
      .then(juice => res.json(juice))
      .catch(next);
  });

module.exports = router;
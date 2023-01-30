const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/comments
router.get('/', (req, res) => {
    Comment.findAll({})
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/', withAuth, (req, res) => {
  // check the session
  if (req.session) {
    Comment.create({
      comment: req.body.comment,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    })
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});

router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(data => {
          if (!data) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
          }
          res.json(data);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

module.exports = router;
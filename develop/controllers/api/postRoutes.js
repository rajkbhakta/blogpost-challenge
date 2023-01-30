const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'created_at',
            'content'
        ],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username', 'twitter', 'github']
          }
        },
        {
          model: User,
          attributes: ['username']
        },
      ]
    })
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  // get a single post
  router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'title',
        'created_at',
        'content'
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No post found' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.post('/', withAuth, (req, res) => {
    Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id
    })
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
       content: req.body.content
      },
      {
        where: {
          id: req.params.id
        }
      })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No post found' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  // delete a post
  router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No post found' });
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
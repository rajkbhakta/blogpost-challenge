const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
          id: req.params.id
        },
        include: [
            {
              model: Post,
              attributes: ['id', 'title', 'content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
                }
            }
          ]

    })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No user found' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// POST /api/users
router.post('/', (req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
    .then(data => {
      req.session.save(() => {
        req.session.user_id = data.id;
        req.session.username = data.username;
        req.session.loggedIn = true;
    
        res.json(data);
         res.redirect('/');

      });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  //api/users/login
  router.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(data => {
      if (!data) {
        res.status(400).json({ message: 'No user found' });
        return;
      }
  
      const validPassword = data.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        // declare session variables
        req.session.user_id = data.id;
        req.session.username = data.username;
        req.session.loggedIn = true;
  
        res.json({ user: data, message: 'You are now logged in!' });
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  // logout ends the session
  router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
  });

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
      }
    })
      .then(data => {
        if (!data[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No user found' });
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
const router = require('express').Router();
const {Post, User, Comment}=require('../models')

router.get('/',(req,res)=> {
  Post.findAll({
    attributes: [
      'id',
      'tittle',
      'content',
      "date",
    ],
    include:[
      {
        model: Comment,
        attributes: [
          "id","comment","post_id","user_id"
        ]
      },
      {
        model:User,
        attributes:[
          "username"
        ]

      }

    ]
  }).then(data =>{

    const posts = data.map(item=>{
      item.get({plain:true})
    })
    res.render('homepage', {
      posts,loggedin:req.session.login
    })
  }).catch(err=> {
    console.log(err)
    res.status(500).json(err)
  })
})

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'date',
      'content'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment', 'post_id', 'user_id', 'date'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(data => {
      if (!data) {
        res.status(404).json({ message: 'No post found' });
        return;
      }
      const post = dbPostData.get({ plain: true });
      res.render('single-post', {
          post,
          loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

const router = require('express').Router()

/* Users : liste */
router.get('/', function(req, res, next) {
  let limit = parseInt(req.query.limit) || 20
  let offset = parseInt(req.query.offset) || 0
  if (limit > 100) limit = 100

  Promise.all([
    db.all('SELECT * LIMIT ? OFFSET ? FROM users', limit, offset),
    db.all('SELECT COUNT(*) as count FROM users')
  ]).then((users) => {
    res.format({
      html: () => {
        res.render('users/index', {
          users:users
        })
      },
      json : () => {
        res.sent({data: users}) }
      })
    })
  }

  res.format({
    html: () => { res.render('users/index', data) },
    json: () => { res.send(data) }
  })
})

router.post('/', (req, res, next) => {
  db.run(
    'INSERT INTO users (pseudo, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
    req.body.pseudo,
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password
  ).then( () => {
    res.format({
      json: () => { res.status(201).send({message:'succes'}) },
      html: () => { res.redirect('/users')}
    })
  }).catch(next) // Erreur renvoyant à la fonction de 4 paramètres sur app.js
})


router.get('/:userId(\\d+)/edit', function(req, res, next) {
  db.get('SELECT rowid,* FROM users WHERE rowid = ?', req.params.userId).then((user) => {

    if(!user) return next()
    res.format({
      html: () => {res.render('users/edit', {user: user}) },
      json: () => {
        let error = new Error('Bad Request')
        error.status = 400
        next(error)
      }
    })
  }).catch(next)
})


router.get('/:userId(\\d+)/add', function(req, res, next) {
  db.get('SELECT rowid,* FROM users WHERE rowid = ?', req.params.userId).then((user) => {
    res.format({
      html: () => {res.render('users/show', {user: user}) },
      json: () => {res.send({data: user}) }
    })
  }).catch(next)
})


router.get('/:userId(\\d+)', function(req, res, next) {
  db.get('SELECT rowid,* FROM users WHERE rowid = ?', req.params.userId).then((user) => {
    res.format({
      html: () => {res.render('users/show', {user: user}) },
      json: () => {res.send({data: user}) }
    })
  }).catch(next)
})


module.exports = router

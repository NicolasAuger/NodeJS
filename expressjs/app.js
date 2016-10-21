#!/usr/bin/env node
const method_override = require('method-override')
const express = require('express')
const db = require('sqlite')
const _ = require('lodash')
const app = express()
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser')

app.set('views', './views')
app.set('view engine', 'pug')

app.use(method_override('_method'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
     extended: true
}))
// Lien vers template PUG

db.open('database.db').then(() => {
  return db.run("CREATE TABLE IF NOT EXISTS users (pseudo, email, firstname, lastname, createdAt, updatedAt)")
})

app.get('/', (req, res, next) => {
  console.log("Works Well !")
  //res.send('Bonjour et bienvenu sur mon API Rest')
  res.render('users/index', {
       title: 'Bonjour !',
       name: 'Nico',
       content: 'Ma première page'
 })
})

// app.post('/users', (req, res, next) => {
//   db.run("INSERT INTO users VALUES ('Demorite','dolan.chamoulaud@tardors.com','Dolan','Chamoulaud','11/10/2016','11/10/2016')").then(() =>{
//     db.all("SELECT * FROM users")
//   }).then((data) => {
//     res.send(data)
//   })
//
// })

app.post('/users', (req, res, next) => {
	var user = req.headers
  var params = req.body
	var date = new Date()
	date = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()
  console.log("salut", params)
	db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)", params.user.pseudo, params.user.email, params.user.firstname, params.user.lastname, date, date).catch((err) => {console.log(err)}).then(() =>{
		return db.get('SELECT rowId, * FROM users WHERE pseudo = ?', params.user.pseudo)
	}).then((data)=>{
		res.send(data)
	})
})



app.get('/users/add', (req, res, next) => {
  console.log(" users / add Works Well !")
  //res.send('Bonjour et bienvenu sur mon API Rest')
  res.render('users/add', {
       title: 'Page Add !',
       text: 'Pour nous rejoindre, rien de plus simple.',
       content: 'Remplissez le formulaire suivant :'
 })
})

app.get('/users/all', (req, res, next) => {
  db.all('SELECT rowid,* FROM users').then((data) =>{
    res.render('users/show_all', {
         title: 'User Profiles',
         text: 'Voici la liste des tous les users',
         users: data
    })
  })
})


app.get('/users/:userId', (req, res, next) => {
  var params = req.body
  return db.all('SELECT rowid,* FROM users WHERE rowid = ?', req.params.userId).then((data) =>{
    res.render('users/show', {
         title: 'User Profil',
         text: 'Voici tes informations personnelles',
         users: data
    })
  })
})

app.get('/users/:userId/edit', (req, res, next) => {
  var params = req.body
  return db.all('SELECT rowid,* FROM users WHERE rowid = ?', req.params.userId).then((data) =>{
    console.log(req.params.userId)
    console.log("salut",data)
    res.render('users/edit', {
         title: 'User Profil',
         text: 'Voici tes informations personnelles',
         special: '/'+req.params.userId+'?_method=PUT',
         users: data
    })
  })
})


app.delete('/users/:userId', (req, res, next) => {
  var params = req.body
  db.run('DELETE FROM users WHERE rowid = ?', req.params.userId)
  res.send()
})


// app.put('/users/:userId', (req, res, next) => {
//   var user = req.body
//   var date = new Date()
//   date = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()
//
//   reqSet = []
//   dbArgs = []
//
//   possibleData = ['pseudo', 'email', 'firstname', 'lastname']
//   for(key in req.body){
//     if(-1 !== possibleData.indexOf(key)) {
//       reqSet.push(`${key} = ?`)
//       dbArgs.push(req.body[key])
//     }
//   }
//
//   reqSet.push(`updatedAt = ?`)
//
//   dbArgs.push(date)
//
//   dbArgs.push(req.params.userId)
//
//   dbArgs.unshift('UPDATE users SET ' + reqSet.join(', ')+ ' WHERE rowid = ?')
//   // console.log(dbArgs)
//
//
//   db.run.apply(db, dbArgs).catch((err) => {console.log(err)})
//   .then(() =>{
//     return db.all('SELECT rowid, * FROM users WHERE rowid = ?', req.params.userId)
//   }).then((data)=>{
//     res.render('users/edit', {
//          title: 'User Profil',
//          datas : 'Voici tes données actuelles :',
//          text: 'Rempli ce formulaire pour changer tes données :',
//          users: data
//     })
//   })
// })

app.put('/users/:userId', (req, res, next) => {
var user = req.body
	var date = new Date()
	date = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()

	reqSet = []
	dbArgs = []

	possibleData = ['pseudo', 'email', 'firstname', 'lastname']
	for(key in req.body){
		if(-1 !== possibleData.indexOf(key)) {
			reqSet.push(`${key} = ?`)
			dbArgs.push(req.body[key])
		}
	}

	reqSet.push(`updatedAt = ?`)

	dbArgs.push(date)

	dbArgs.push(req.params.userId)

	dbArgs.unshift('UPDATE users SET ' + reqSet.join(', ')+ ' WHERE rowid = ?', req.params.userId)
	// console.log(dbArgs)

	db.run.apply(db, dbArgs).catch((err) => {console.log(err)})
	.then(() =>{
		return db.all('SELECT rowid, * FROM users WHERE rowid = '+req.params.userId)
	}).then((data)=>{
		res.render('users/show',
		{
			title: 'Users table',
			users: data
		})
		res.redirect('/users/'+req.params.userId)
	})
})


app.listen(PORT, () => {
  console.log('Serveur sur port : ', PORT)
})

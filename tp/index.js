#!/usr/bin/env node
var request = require('request')
var api = require('marvel-comics-api')
var jsonfile = require('jsonfile')
const fs = require('fs')

// fetch 50 Marvel characters
api('characters',{
  publicKey:'f0d7216b8d28b6b2e3663bbddea59f57',
  privateKey:'a5975525cca5db1e1abdb5e79cd1481f8e761fcb',
  timeout:4000,
  query:{
    limit:50
  }
}, function(err, body){
  if (err) throw err



//total # of items
//console.log(body.data.total)

//array of charcaters
//console.log(body.data.results)
//console.log(body.data.results)


try{
       var resultat = JSON.stringify(body.data.results)
       fs.writeFile('marvel.json', resultat, (err) => {
         if (err) throw err
         console.log('Fichier ecrit')
       })
     }
       catch (err){
         console.log('Error > ', err)
     }
     //console.log(body.data.results);

//jsonfile.readFile(resultat, function(err, obj) {
   // console.dir(obj)
 //console.log(obj['name']); })

})




// request('http://gateway.marvel.com/v1/public/characters', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//
//   }
// })

#!/usr/bin/env node

const rl = require('readline').createInterface({
  input: process.stdin, output: process.stdout
})

var request = require('request')
var api = require('marvel-api')
var jsonfile = require('jsonfile')
const fs = require('fs')
const _ = require('lodash')
const db = require('sqlite')
const inquirer = require('inquirer')
var program = require('commander')

db.open(':memory:').then((res) => {
  db.run("CREATE TABLE IF NOT EXISTS marvel (heroes)")
})

var marvel = api.createClient({
  publicKey:'f0d7216b8d28b6b2e3663bbddea59f57',
  privateKey:'a5975525cca5db1e1abdb5e79cd1481f8e761fcb'
})

program
  .version('1.0')
  .option('-c, --characters', 'Liste des 20 premiers Heros de Marvel')
  .option('-m, --main', 'Demarre le programme Main')
  .parse(process.argv)


if(program.characters) {
  marvel.characters.findAll()
  .then(function(res){
    console.log('\nVoici la liste des 20 premiers Heros de Marvel : \n');
    for (let i = 0; i < res.data.length ; i++){
        console.log(res.data[i].name);
    }
  })
  .fail(console.error)
  .done()
}else if (program.main) {

  var heroSearched = function(){
    rl.question('\nQuel Hero de Marvel cherches-tu ? : ', (answer) => {
      process.stdout.write("\nTu as répondu : " + answer + "\n")

      var question1 = "Voir sa description"
      var question2 = "Dans quels comics apparaît-il(elle) ?"
      var question3 = "Dans quelles series apparait-il(elle) ?"
      var question4 = "Dans quelles histoires apparait-il(elle) ?"
      var question5 = "Dans quels evenements apparait-il(elle)?"

      marvel.characters.findByName(answer)
      .then(function(res) {
        console.log('ID de votre Hero : ', res.data[0].id);
        inquirer.prompt([
          {
            type: 'list',
            message: 'Que veux tu savoir ?',
            name: 'hero',
            choices: [
              question1,
              question2,
              question3,
              question4
            ]
          }
        ]).then((answers) => {
          if (answers.hero == question1) {
            console.log('Description du Hero : ', res.data[0].description)
            return res.data[0].description
          }
          else if (answers.hero == question2) {
            console.log('20 Comics dans lesquels le hero apparait : ', res.data[0].comics)
            return res.data[0].comics
          }
          else if (answers.hero == question3) {
            console.log('20 Series dans lesquelles apparait le hero : ', res.data[0].series)
            return res.data[0].series
          }
          else if (answers.hero == question4) {
            console.log('20 Histoires dans lesquelles se trouve le Hero : ', res.data[0].stories)
            return res.data[0].stories
          }
          else if (answers.hero == question5) {
            console.log('20 Evenements dans lesquels le hero est present : ', res.data[0].events)
            return res.data[0].events
          }
        })

      })
      .fail(console.error)
      .done()
    })
  }

  heroSearched()
}else{
  program.help()
}

#!/usr/bin/env node

const rl = require('readline').createInterface({
  input: process.stdin, output: process.stdout
})

var request = require('request')
var api = require('marvel-api')
var jsonfile = require('jsonfile')
const lowerCase = require('lower-case')
const fs = require('fs')
const _ = require('lodash')
const db = require('sqlite')
const inquirer = require('inquirer')
var program = require('commander')

db.open('marvel.db').then((res) => {
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
  .option('-d, --database', 'Affiche ce qui se trouve dans la base de donnee')
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
}else if (program.database) {
  db.each("SELECT * FROM marvel", function(err, row) {
    console.log(row.heroes)
  })
}else if (program.main) {

  var heroSearched = function(){
    rl.question('\nQuel Hero de Marvel cherches-tu ? : ', (answer) => {
      process.stdout.write("\nTu as répondu : " + answer + "\n")

      var question1 = "Voir sa description"
      var question2 = "Dans quels comics apparaît-il(elle) ?"
      var question3 = "Dans quelles series apparait-il(elle) ?"
      var question4 = "Dans quelles histoires apparait-il(elle) ?"
      var question5 = "Dans quels evenements apparait-il(elle)?"

      // Je cherche dans l'api le hero par son nom
      marvel.characters.findByName(answer)
      .then(function(res) {

        db.run("INSERT INTO marvel VALUES (?)", [res.data[0].name])
        try {
          //On ecrit dans un fichier l'ID, le nom, et la description du hero choisi
          // On donne le nom de hero choisi comme nom de fichier.json
          fs.writeFile(''+lowerCase(answer)+'.json', 'ID du Hero : ' + res.data[0].id + '\n\nNom du Hero : ' + res.data[0].name + '\n\nDescription du Hero : ' + res.data[0].description, (err) => {
            if (err) throw err
            console.log('Fichier ecrit')
          })
        }
        catch (err) {
          console.error('ERR > ', err)
        }

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
              question4,
              question5
            ]
          }
        ]).then((answers) => {
          if (answers.hero == question1) {
            console.log('\nDescription du Hero : ', res.data[0].description)
            return res.data[0].description
          }
          else if (answers.hero == question2) {
            console.log("\n20 Comics dans lesquels le hero apparait : \n")
            for (let i = 0 ; i < res.data[0].comics.items.length ; i++){
              console.log(res.data[0].comics.items[i].name)
            }
            return res.data[0].comics
          }
          else if (answers.hero == question3) {
            console.log("\n20 Series dans lesquelles le hero apparait : \n")
            for (let i = 0 ; i < res.data[0].series.items.length ; i++){
              console.log(res.data[0].series.items[i].name)
            }
            return res.data[0].series
          }
          else if (answers.hero == question4) {
            console.log("\n20 Stories dans lesquels le hero apparait : \n")
            for (let i = 0 ; i < res.data[0].stories.items.length ; i++){
              console.log(res.data[0].stories.items[i].name)
            }
            return res.data[0].stories
          }
          else if (answers.hero == question5) {
            console.log("\n20 Events dans lesquels le hero apparait : \n")
            for (let i = 0 ; i < res.data[0].events.items.length ; i++){
              console.log(res.data[0].events.items[i].name)
            }
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

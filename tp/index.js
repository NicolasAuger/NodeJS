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

console.log("\nBonjour et bienvenu dans le TP de NodeJS");
console.log("\nThème choisi : Heros de Marvel");

// Clé publique et clé privée
var marvel = api.createClient({
  publicKey:'f0d7216b8d28b6b2e3663bbddea59f57',
  privateKey:'a5975525cca5db1e1abdb5e79cd1481f8e761fcb'
})

program  // Utilisation de commander
.version('1.0')
.option('-c, --characters', 'Liste des 100 premiers Heros de Marvel')
.option('-m, --main', 'Demarre le programme Main')  // Recherche du hero souhaité + mise en base + choix de ce que l'on veut découvrir.
.option('-d, --database', 'Affiche ce qui se trouve dans la base de donnee')
.parse(process.argv)

if(program.characters){
  first_hundred_characters()
}else if (program.main){
  start()
}else if(program.database){
  print_database()
}

function start(){
  // Création d'une bdd dans le fichier marvel.db
  db.open('marvel.db').then(() => {
    //Création de la table heroes dans la bdd marvel (si elle n'existe pas)
    db.run("CREATE TABLE IF NOT EXISTS marvel (heroes)")
  })


  rl.question('\nQuel Hero de Marvel cherches-tu ? : ', (answer) => {
    process.stdout.write("\nTu as répondu : " + answer + "\n")

    // Je cherche dans l'api le hero par son nom
    marvel.characters.findByName(answer)
    .then(function(res) {

      try {
        db.run("INSERT INTO marvel VALUES (?)", [res.data[0].name])
        //On ecrit dans un fichier l'ID, le nom, et la description du hero choisi
        // On donne le nom de hero choisi comme nom de fichier.json
        fs.writeFile(''+lowerCase(answer)+'.json', 'ID du Hero : ' + res.data[0].id + '\n\nNom du Hero : ' + res.data[0].name + '\n\nDescription du Hero : ' + res.data[0].description, (err) => {
          if (err) throw err
          console.log('Fichier ecrit')
          console.log('ID de votre Hero : ', res.data[0].id);

          user_choice(res)
        })
      }
      catch (err) {
        console.error("Ce hero n'existe pas, ou alors verifie l'orthographe")
        start()
      }
    })
    .fail(console.error)
    .done()
  })
}

function user_choice(res){

  var question1 = "Voir sa description"
  var question2 = "Dans quels comics apparaît-il(elle) ?"
  var question3 = "Dans quelles series apparait-il(elle) ?"
  var question4 = "Dans quelles histoires apparait-il(elle) ?"
  var question5 = "Dans quels evenements apparait-il(elle)?"

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
}

function print_database(){
  db.open('marvel.db').then(() => {
    return db.all("SELECT * FROM marvel")
  }).then((data) => {
    console.log("data : ", data);
  })
}

function first_hundred_characters(){
  marvel.characters.findAll(100, 0) // Affiche 100 heros à partir de l'index 0 = à partir du premier hero
  .then(function(res){
    console.log('\nVoici la liste des 100 premiers Heros de Marvel : \n');
    for (let i = 0; i < res.data.length ; i++){
      console.log(res.data[i].name);
    }
  })
  .fail(console.error)
  .done()
}

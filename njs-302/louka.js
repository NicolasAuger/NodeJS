#!/usr/bin/env node

const fs = require('fs')

try {
  fs.writeFile('message.txt', 'Bonjour !', (err) => {
    if (err) throw err
    console.log('Fichier ecrit')
  })

  fs.readFile('message.txt', 'utf8', (err, data) => {
    if (err) throw err
    console.log('Données du fichier : ' + data)
  })
}
  catch (err) {
    console.error('ERR > ', err)
  }

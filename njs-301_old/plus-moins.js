// Initialisation
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

// On sélectionne un nombre à trouver entre 0 et 999
const nb = Math.floor(Math.random() * 1000)

// Variable qui nous permet de stocker le nombre de coup joués
let currentTry = 1

// On écrit une petite info à l'utilisateur
process.stdout.write("J'ai choisi mon nombre entre 0 et 999, à toi de jouer !\n")

// On pose la première question
prompt()

// On pose une question
function prompt(){
  rl.question(`\nCoup ${currentTry} : `, checkInput)
}

// Fonction qui gère la logique du jeu
function checkInput(input){
  // Et on vérifie que c'est bien un nombre est qu'on a de 1 à 3 caractères
  if (!/^\d{1,3}$/.test(input)) {
    process.stdout.write("Je ne peux gérer que des nombres à 3 chiffres.\n")
  } else {
    // On fait notre logique
    if (input > nb) {
      process.stdout.write("C'est inférieur !\n")
    } else if (input < nb) {
      process.stdout.write("C'est supérieur !\n")
    } else {
      process.stdout.write(`Bravo, tu as trouvé en ${currentTry} coups !\n`)
      return process.exit()
    }

    // On incrémente notre compteur de coups
    currentTry++
  }

  // On repose la question à l'utilisateur
  prompt()
}

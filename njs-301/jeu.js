// Initialisation
const rl = require('readline').createInterface({
  input: process.stdin, output: process.stdout
})

var n = Math.floor(Math.random() * 100);
var coup = 0;
console.log(n);

var func = function () {
  rl.question('Nombre entre 0 et 100 : ', (answer) => {
    process.stdout.write("Tu as répondu : " + answer + "\n")

    if (answer < n) {
      console.log('Le nombre est plus grand');
      func()
    } else if (answer > n) {
      console.log('Le nombre est plus petit');
      func()
    } else {
      console.log('Bravo');
      console.log('En '+ coup + ' coups');
      process.exit()
    }

  })
  ++coup;
}

func()

// Retourne un entier aléatoire entre 0 et 10







// RegExp qui retourne true si input contient 1 à 3 chiffres
///^\d{1,3}$/.test(input)

// Quitte le programme

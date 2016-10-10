const http = require('http')
const qs = require('querystring')
const db = require ('sqlite')

//Simple Web Server
http.createServer((req, res) => {
  console.log(req.method) // GEt ou POST
  console.log(req.url) // '/livre-d-or'

  //SOIT une page html
  res.writeHead(200, {'Content-Type': 'text/html'})

  //Soit ue redirection vers '/livre-d-or'
  //res.writeHead(302, {'Location': '/livre-d-or'})
  //Ecriture d'une page html
  res.write(`
    <html>
        <body>
          <h1>Livre d'Or</h1>
          <div class="comments">
              <p class="comments">
                  Jean le 10/05/2024 : Oui ça marche bien
              </p>
              <p class="comments"
                  Emmilie le 09/05/2024 : Bonjour, c'est super !
              </p>
          </div>
          <form method="post">
              <label for="pseudo">
                  Pseudo :
                  <input type="text" id="pseudo" name="pseudo" />
              </label>
              </br>
              <label for="comments">
                  Commentaire :
                  <textarea id="comment" name="comment"></textarea
              </label>
              </br>
              <input type="submit" value="Envoyer" />
          </form>
      </body>
    </html>
    `)
  res.end() // Toutes les données ont été envoyées
}).listen(8081)



////// Récupération des données POST du formulaire

//Il suffit d'écouter les deux évènements sur l'objet req:
// - 'data' => Renvoie les données du formulaire au fur et à mesure
// - 'end' => Appelé une fois que toutes les données sont arrangées
//req.on('data', (data) =>{console.log(data) })

// qs permet de parser des données :
let params = qs.parse('foo=3&bar=5')
console.log(params.foo) // => 3


/////////// DATABASE

//Ouvre une session SQlite stockée en mémoire vive (Promise)
//db.open(':memory:')

//Simple SQL (Promise)
//db.run("CREATE TABLE IF NOT EXIST comments pseudo, comment, createdAt)")

//Tableau de tous résultats (Promise)
//db.all("SELECT * FROM comments WHERE pseudo = ?", 'toto')

// Prmeier résultats (Promise)
//db.get("SELECT * FROM comments WHERE pseudo = ?", 'toto')

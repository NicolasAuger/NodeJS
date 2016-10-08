// Réalisé en 21min

// Définition de nos dépendances
const http = require('http')
const qs = require('querystring')
const db = require('sqlite')

// Définition de nos constantes
const PORT = 8081

const TPL_BEFORE_COMMENT_LIST = `
  <html>
    <body>
      <h1>Livre d'or</h1>
      <div class="comments">
`
const TPL_AFTER_COMMENT_LIST = `
      </div>
      <form method="post">
        <label for="pseudo">
          Pseudo :
          <input type="text" id="pseudo" name="pseudo" />
        </label>
        <br />
        <label for="comment">
          Commentaire :
          <textarea id="comment" name="comment"></textarea
        </label>
        <br />
        <input type="submit" value="Envoyer" />
      </form>
    </body>
  </html>
`

// Base de donnée
// On ouvre une session sqlite en mémoire
db.open('livre-d-or.db').then(() => {
  // Une fois la base ouverte, on créé une table
  // On n'oublie pas le return qui va permettre de faire suivre la Promise
  // et donc de gérer le "catch" plus bas, en cas d'erreur
  return db.run('CREATE TABLE IF NOT EXISTS comments (pseudo, comment, createdAt)')
}).then(() => {
  console.log('> Base de donnée prête')
}).catch((err) => { // Si on a eu des erreurs
  console.error('ERR> ', err)
})

// Simple serveur WEB
http.createServer((req, res) => {
  // Si on n'est pas sur la bonne url, on retourne une 404 Not Found
  // Il est également possible de rediriger vers la bonne page ici
  if (req.url !== '/') {
    // Le code ci dessous peut-être écris soit :
    res.statusCode = 404
    res.statusMessage = 'Not Found'
    // Soit :
    // res.writeHead(404)
    // res.write('Not Found')

    // Dans tous les cas, on stoppe ici, on ne va même pas plus loin, puisqu'on
    // est pas sur la bonne url.
    return res.end()
  }

  // Maintenant
  if (req.method === 'GET'){  // Si on est en GET, c'est juste de l'affichage
    showPage(req, res) // On appelle juste la méthode qui affiche la page
  }
  else if (req.method === 'POST') { // Si on est en POST, le formulaire arrive

    // On appelle la méthode qui récupère les données POST de la requète
    // cette méthode (définie plus bas), retourne une Promise
    getPostData(req).then((postData) => { // une fois fini
      // on sauvegarde les données en base et on fait suivre la Promise que nous
      // retourne saveComment
      return saveComment(postData)
    }).catch((err) => {
      // Si on a une erreur, on la traite ici
      console.error('ERR > ', err)
    }).then(() => {
      // Dans tous les cas, on peut afficher la page
      showPage(req, res)
    })

  } else { // Si on n'est ni en GET, ni en POST, on ne gère pas donc on retourne une erreur
    res.statusCode = 405
    res.end('Method Not Allowed')
  }
}).listen(PORT, () => { // listen, peut aussi prendre une fonction de callback, appelée lorsque le serveur sera démarré
  console.log(`> Serveur démarré sur le port ${PORT}`)
})


// DEFINITIONS DES METHODES

// Récupérer les données POST
// retourne une Promise
function getPostData (req) {
  // Comme les données du body arriveront possiblement en plusieurs fois,
  // on définit une variable body, qui nous permettra de les stocker au fur et à
  // mesure qu'elles arrivent
  let body = ''

  // Lorsque des données arrivent, on les charge dans notre variable `body`
  req.on('data', (incomingBodyChunk)=> {
    body += incomingBodyChunk
  })

  // getPostData() doit retourner une Promise,
  // mais `req.on` ne gère pas les promises...
  // Du coup on va créer notre propre Promise
  // qui ne sera résolue que dans le `req.on('end')` quand on est sûr d'avoir
  // toutes les données avant de passer à la suite
  return new Promise((resolve, reject) => {
    req.on('end', () => {
      // On peut parser le body
      let params = qs.parse(body)

      // Et finalement, on résoud la promesse, en lui passant les "params" qui
      // correspond à un objet tel `{ pseudo: 'Jeremy', comment: 'Salut !' }`
      resolve(params)
    })
  })
}

// Sauvegarde un commentaire
// Prends un objet en entrée
// Retourne une Promise
function saveComment(commentData) {
  // Simple vérification pour être sûr d'avoir un pseudo et un commentaire non vide
  if (!commentData.pseudo || !commentData.comment || commentData.comment == '' || commentData.pseudo == '') {
    // Si on a une erreur, on peut faire quelque chose de malin, que je n'ai pas dit en cours
    // Sur Promise, on a des méthodes de de classe, notemment `all` (vu en cours), mais aussi `resolve` et `reject`
    // qui retourne des Promise, déjà résolu, ou rejeté avec ce qu'il y a en argument
    // Ici on Promise.reject() retournera donc une nouvelle Promise déjà rejetée (jamais passé par le statut "en attente")
    return Promise.reject(new Error('Il y a un problème avec le formulaire'))
  }

  // On récupère la date sous forme de Timestamp
  let timestamp = (new Date()).getTime()

  // On insère en base, et on retourne une Promise, ça tombe, bien les méthodes de db retournent des Promise ;)
  return db.run('INSERT INTO comments VALUES (?, ?, ?)', commentData.pseudo, commentData.comment, timestamp)
}

// Handle GET calls
function showPage (req, res) {
  // Statut: 200, Contenu: page HTML
  res.writeHead(200, {'Content-Type': 'text/html'})

  // On commence à écrire le début de notre HTML
  res.write(TPL_BEFORE_COMMENT_LIST)

  // On lance la récupération des commentaires
  // Puis ensuite, une fois chargés...
  db.all('SELECT * FROM comments ORDER BY createdAt DESC').then((comments) => {
    // ...on fait une boucle commentaire par commentaire
    for (let i = 0, l = comments.length; i < l; i++) {
      let comment = comments[i]

      // On convertit le timestamp stocké en date lisible
      let date = new Date(comment.createdAt)
      date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

      // On écrit le commentaire
      res.write(`
        <p class="comment">
          ${comment.pseudo} le ${date} : ${comment.comment}
        </p>
      `)
    }
  }).catch((err) => { // On gère les erreurs possibles
    console.error('ERR> ', err)
  }).then(() => { // Dans tous les cas
    // On écrit la fin de la page
    res.write(TPL_AFTER_COMMENT_LIST)

    // On finalise la réponse
    res.end()
  })
}

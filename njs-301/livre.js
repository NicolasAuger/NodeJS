const http = require('http')
const qs = require('querystring')
// Simple serveur WEB

const db = require('sqlite')
db.open(':memory:').then((res) => {
  db.run("CREATE TABLE IF NOT EXISTS comments (pseudo, comment, createAt)")
})

http.createServer((req, res) => {
  console.log(req.method) // GET ou POST
  console.log(req.url) // '/livre-d-or'
  // SOIT une page HTML
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8;'})
  // SOIT une redirection vers "/livre-d-or"
  //res.writeHead(302, {'Location': '/livre-d-or'})
  // Écriture d'une page HTML
  res.write(`
    <html>
    <body>
    <h1 style="font-size:30px;">Livre d'or</h1>
    <table>
    <form method="post">
    <label for="pseudo">
    <p style="font-size:14px;">Pseudo :</p>
    <div class="input-field col s6">
    <input type="text" id="pseudo" name="pseudo" />
    </div>
    </label>
    <br />
    <label for="comment">
    <p style="font-size:14px;">Commentaire :</p>
    <textarea id="comment" name="comment"></textarea>
    </label>
    <br/>
    <tr>
    <td><input type="submit" value="Envoyer" /></td>
    </tr>
    </form>
    </table>
    <br><br>
    </body>
    </html>
    `)

    var body = '';

    req.on('data', (data) => {
      body += data
    })

    req.on('end', () => {
      console.log(body)
      let params = qs.parse(body)
      console.log(params.pseudo)
      console.log(params.comment)

      var date = new Date();
      console.log(date.getTime());

      //var date2 = new Date(date.getTime())
      //console.log(date2.getHours())
      //console.log(date2.getFullYear())

      db.run("INSERT INTO comments VALUES (?,?,?)", [params.pseudo, params.comment, date ]);
      console.log('Mise en base : ' + params.pseudo);


      db.each("SELECT * FROM comments", function(err, row) {
        var date2 = new Date(row.createAt)
        res.write(`<div class="comments" style="font-size:16px;">
        <p>
        <b>${row.pseudo}</b>  : ${row.comment} [<i>${date2.getDay()}/${date2.getMonth()}/${date2.getFullYear()}</i>]
        </p>
        </div>`)
      })



    })


}).listen(8081)

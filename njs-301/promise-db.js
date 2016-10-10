const db = require('sqlite')

db.open('file.db').then(() => {
  return db.run('CREATE TABLE IF NOT EXISTS comments (pseudo, comment, createdAt)')
}).then(() => {
  return db.all('SELECT * FROM comments')
}).then((users) => {
  console.log(users)
}).catch((err) => {
  console.log('ERR > ', err)
}).then((){
  console.log('toujours écrit!')
})

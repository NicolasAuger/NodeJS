const http = require('http')

http.createServer((req, res) => {
  res.end('Bonjour à tous !')
}).listen(8080)

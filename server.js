const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const port = process.argv[2] || 8000

const fileTypeMap = {
    '.ico'  : 'image/x-icon',
    '.html' : 'text/html',
    '.js'   : 'text/javascript',
    '.json' : 'application/json',
    '.css'  : 'text/css',
    '.png'  : 'image/png',
    '.jpeg' : 'image/jpeg',
    '.wav'  : 'audio/wav',
    '.mp3'  : 'audio/mpeg',
    '.svg'  : 'image/svg+xml',
    '.pdf'  : 'application/pdf',
    '.doc'  : 'application/msword',
    '.eot'  : 'application/vnd.ms-fontobject',
    '.ttf'  : 'application/font-sfnt'
}

http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`)

    const parsedUrl = url.parse(req.url)

    let sanitize = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '')
    let pathName = path.join(__dirname, sanitize)

    fs.exists(pathName, function(exist) {
        if (!exist) {
            res.statusCode = 404
            res.end(`File ${pathName} not found!`)

            return
        }

        if (fs.statSync(pathName).isDirectory()) pathName += '/index.html'

        fs.readFile(pathName, function(err, data) {
            if (err) {
                res.statusCode = 500
                res.end('Error getting the file.')
                console.log(`Error getting the file (${pathName}). ${err}`)
            }

            const ext = path.parse(pathName).ext
            
            res.setHeader('Content-type', fileTypeMap[ext] || 'text/plain')
            res.end(data)
        })
    })
}).listen(parseInt(port))

console.log(`Server is listening port ${port}`)
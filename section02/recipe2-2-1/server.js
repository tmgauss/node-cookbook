/*
* Recipe 2.2.1
* */

const http = require('http');
const formidable = require('formidable');
const form = require('fs').readFileSync(`${__dirname}/form.html`);

http.createServer(function (req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(form);
    }
    if (req.method === 'POST') {
        const incoming = new formidable.IncomingForm();
        incoming.uploadDir = `${__dirname}/uploads`;
        incoming.on('file', (field, file) => {
            if (!file.size) { return; }
            res.write(`${file.name} was received\n`);
        }).on('field', (field, value) => {
            res.write(`${field} : ${value}\n`);
        }).on('end', () => {
            res.end('All the file were received\n');
        })
        incoming.parse(req);
    }
}).listen(8080);


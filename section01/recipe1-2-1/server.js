/*
* Mini recipe 1.2.1
* */

let http = require('http');
let path = require('path');
let fs = require('fs');

const mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
};

http.createServer(function(request, response) {
    if (request.url === '/favicon.ico') {
        response.writeHead(404);
        response.end();
        return ;
    }

    let lookup = path.basename(decodeURI(request.url)) || 'index.html';
    let f = `${__dirname}/content/${lookup}`;

    fs.exists(f, exists => {
        if (exists) {
            fs.readFile(f, (err, data) => {
                if (err) {
                    response.writeHead(500);
                    response.end('Server Error\n')
                }
                const headers = {'Content-Type': mimeTypes[path.extname(f)]};
                response.writeHead(200, headers);
                response.end(data);
            });
            return ;
        }
        response.writeHead(404);
        response.end('Page Not Found\n');
    });
}).listen(8080);
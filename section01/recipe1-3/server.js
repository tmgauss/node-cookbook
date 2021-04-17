/*
* Recipe 1.3
* */

let http = require('http');
let path = require('path');
let fs = require('fs');

const mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
};

let cache = {};

function cacheAndDeliver(f, cb) {
    if (!cache[f]) {
        fs.readFile(f, (err, data) => {
            if (!err) {
                cache[f] = {content: data};
            }
            cb(err, data);
        })
        return ;
    }
    console.log(`Read from cache: ${f}`);
    cb(null, cache[f].content);
}

http.createServer(function(request, response) {
    let lookup = path.basename(decodeURI(request.url)) || 'index.html';
    let f = `${__dirname}/content/${lookup}`;

    fs.exists(f, exists => {
        if (exists) {
            cacheAndDeliver(f, (err, data) => {
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
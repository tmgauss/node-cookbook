/*
* Mini recipe 1.3.1
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
    fs.stat(f, (err, stats) => {
        const lastChanged = Date.parse(stats.ctime);
        const isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;
        if (!cache[f] || isUpdated) {
            fs.readFile(f, (err, data) => {
                console.log(`Read from file: ${f}`)
                if (!err) {
                    cache[f] = {
                        content: data,
                        timestamp: Date.now(),
                    };
                }
                cb(err, data);
            })
            return ;
        }
        console.log(`Read from cache: ${f}`);
        cb(null, cache[f].content);
    })
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
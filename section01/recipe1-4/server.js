/*
* Recipe 1.4
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

http.createServer(function(request, response) {
    let lookup = path.basename(decodeURI(request.url)) || 'index.html';
    let f = `${__dirname}/content/${lookup}`;

    fs.exists(f, exists => {
        if (exists) {
            const headers = {'Content-Type': mimeTypes[path.extname(f)]};
            if (cache[f]) {
                response.writeHead(200, headers);
                response.end(cache[f].content);
                return ;
            }
            let s = fs.createReadStream(f)
                .once('open', function() {
                    response.writeHead(200, headers);
                    this.pipe(response);
                })
                .once('error', e => {
                    console.log(e);
                    response.writeHead(500);
                    response.end('Server Error');
                })
            fs.stat(f, (err, stats) => {
                let bufferOffset = 0;
                cache[f] = {content: Buffer.alloc(stats.size)};
                s.on('data', data => {
                    data.copy(cache[f].content, bufferOffset);
                    bufferOffset += data.length;
                });
            });
            return ;
        }
        response.writeHead(404);
        response.end('Page Not Found\n');
    });
}).listen(8080);
/*
* Mini recipe 1.4.1
* */

let http = require('http');
let path = require('path');
let fs = require('fs');

const mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
};

let cache = {
    store: {},
    maxSize: 25 * (2 * 20), // 25MB
    maxAge: 1.5 * 60 * 60 * 1000, // 1.5h
    cleanAfter: 2 * 60 * 60 * 1000, // 2h
    cleanedAt: 0,
    clean: function(now) {
        if (now - this.cleanAfter > this.cleanedAt) {
            this.cleanedAt = now;
            let that = this;
            Object.keys(this.store).forEach(file => {
                if (now > that.store[file].timestamp + that.maxAge) {
                    delete that.store[file];
                }
            });
        }
    }
};

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
                if (stats.size < cache.maxSize) {
                    let bufferOffset = 0;
                    cache.store[f] = {
                        content: Buffer.alloc(stats.size),
                        timestamp: Date.now(),
                    };
                    s.on('data', data => {
                        data.copy(cache.store[f].content, bufferOffset);
                        bufferOffset += data.length;
                    });
                }
            });
            return ;
        }
        response.writeHead(404);
        response.end('Page Not Found\n');
    });

    cache.clean(Date.now());
}).listen(8080);
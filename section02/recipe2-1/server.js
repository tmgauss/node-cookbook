/*
* Recipe 2.1
* */

const http = require('http');
const querystring = require('querystring');
const util = require('util');
const form = require('fs').readFileSync(`${__dirname}/form.html`);

const maxData = 2 * (2 ** 20); // 2MB

http.createServer(function (req, res) {
    if (req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(form);
    }
    if (req.method === 'POST') {
        let postData = '';
        req.on('data', chunk => {
                postData += chunk;
                if (postData.length > maxData) {
                    postData = '';
                    this.pause();
                    res.writeHead(413);
                    res.end('Too big request');
                }
            }).on('end', () => {
                if (!postData) { res.end(); return; }
                const postDataObject = querystring.parse(postData);
                console.log(`You have submitted this data:\n${postData}`);
                res.end(`You have submitted this data:\n${util.inspect(postDataObject)}`);
            });
    }
}).listen(8080);


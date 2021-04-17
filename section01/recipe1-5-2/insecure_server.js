/*
*
* */

let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');

const whitelist = [
    '/index.html',
    '/css/styles.css',
    '/js/script.js'
];

http.createServer(function(request, response) {
    let lookup = url.parse(decodeURI(request.url)).pathname;
    lookup = (lookup === '/') ? '/index.html' : lookup;
    if (whitelist.indexOf(lookup) === -1) {
        response.writeHead(404);
        response.end('Page Not Found\n');
        return ;
    }
    const f = `${__dirname}/content${lookup}`;
    console.log(f);
    fs.readFile(f, (err, data) => {
        response.end(data);
    });
}).listen(8080);
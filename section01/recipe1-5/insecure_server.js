/*
* Recipe 1.5
*
* note: Url library of Node make an relative url invalid
*
* */

let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');


http.createServer(function(request, response) {
    let lookup = url.parse(decodeURI(request.url)).pathname;
    // lookup = path.normalize(lookup);
    lookup = (lookup === '/') ? '/index.html' : lookup;
    const f = `${__dirname}/content${lookup}`;
    console.log(f);
    fs.readFile(f, (err, data) => {
        response.end(data);
    });
}).listen(8080);
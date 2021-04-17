/*
* Mini recipe 1.1.2
* */

let http = require('http');
let url = require('url');

const pages = [
    {id: '1', route: '', output: 'Woohoo!\n'},
    {id: '2', route: 'about', output: 'This is a simple, sample code.\n'},
    {id: '3', route: 'another page', output: function() { return `This is ${this.route}\n`}},
];

http.createServer(function(request, response) {
    let id = url.parse(decodeURI(request.url), true).query.id;

    // For routing
    if (id) {
        pages.forEach(page => {
            if (page.id === id) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(typeof page.output === 'function' ? page.output() : page.output);
            }
        })
    }

    // Judge Error (404)
    if (!response.finished) {
        response.writeHead(404);
        response.end('Not found\n')
    }
}).listen(8080);
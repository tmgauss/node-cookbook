/*
* Mini recipe 1.1.1
* */

let http = require('http');

const pages = [
    {route: '/', output: 'Woohoo!\n'},
    {route: '/about/this', output: 'Multiple-phase routing\n'},
    {route: '/about/node', output: 'Event i/o for V8 engine\n'},
    {route: '/another page', output: function() { return `This is ${this.route}\n`}},
];

http.createServer(function(request, response) {
    let lookup = decodeURI(request.url);

    // For routing
    pages.forEach(page => {
        if (page.route === lookup) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(typeof page.output === 'function' ? page.output() : page.output);
        }
    });

    // Judge Error (404)
    if (!response.finished) {
        response.writeHead(404);
        response.end('Not found\n')
    }
}).listen(8080);
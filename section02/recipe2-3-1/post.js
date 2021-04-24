/*
* Recipe 2.3.1
* */

const http = require('http');

const urlOpts = {
    host: 'localhost',
    path: '/',
    port: '8080',
    method: 'post'
};

const request = http.request(urlOpts, res => {
    res.on('data', chunk => {
        console.log(chunk.toString());
    }).on('error', e => {
        console.log(`Error: ${e.stack}`);
    })
})

process.argv.forEach((postItem, index) => {
    if (index > 1) { request.write(postItem); }
});

request.end();
/*
* Recipe 2.1.1
* */

const connect = require('connect');
const util = require('util');
const form = require('fs').readFileSync(`${__dirname}/form.html`);

const app = connect()
    .use(connect.bodyParser())
    .use(connect.limit('64kb'))
    .use((req, res) => {
        if (req.method === 'POST') {
            console.log(`You have submitted this data:\n${req.body}`);
            res.end(`You have submitted this data:\n${util.inspect(req.body)}`);
        }
        if (req.method === 'GET') {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(form);
        }
    })
    .listen(8080)

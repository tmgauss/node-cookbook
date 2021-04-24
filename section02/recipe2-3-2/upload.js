/*
* Recipe 2.3.2
* */

const http = require('http');
const fs = require('fs');

const urlOpts = {
    host: 'localhost',
    path: '/',
    port: '8080',
    method: 'post'
};
let boundary = Date.now();
urlOpts.headers = {
    'Content-Type': `multipart/form-data; boundary="${boundary}"`
}

boundary = `--${boundary}`;
const request = http.request(urlOpts, res => {
    res.on('data', chunk => {
        console.log(chunk.toString());
    }).on('error', e => {
        console.log(`Error: ${e.stack}`);
    })
});

(function multipartAssembler(files) {
    const f = files.shift();
    const fSize = fs.statSync(f).size;
    let progress = 0;
    fs.createReadStream(f)
        .once('open', () => {
            request.write(
                `${boundary}\r\n`
                + `Content-Disposition: form-data; name="userfile"; filename="${f}"\r\n`
                + 'Content-Type: application/octet-stream\r\n'
                + 'Content-Transfer-Encoding: binary\r\n\r\n'
            );
        }).on('data', chunk => {
            request.write(chunk);
            progress += chunk.length;
            console.log(`${f}: ${Math.round((progress / fSize) * 10000) / 100}%`);
        }).on('end', () => {
            if (files.length) {
                request.write('\r\n');
                multipartAssembler(files);
                return;
            }
            request.end(`\r\n${boundary}--\r\n\r\n\r\n`);
        })
}(process.argv.splice(2, process.argv.length)));

/*
* Recipe 2.4
* */

const http = require('http');
const fs = require('fs');

const options = {
    file: '50meg',
    fileSize: fs.statSync(options.file).size,
    kbps: 32
};

http.createServer((req, res) => {
    const download = {
        ...options,
        chunks: new Buffer(download.fileSize),
        bufferOffset: 0
    };
    res.writeHeader(200, {'Content-Length': download.fileSize});
    fs.createReadStream(download.file)
        .on('data', chunk => {
            chunk.copy(download.chunks, download.bufferOffset);
            download.bufferOffset += chunk.length;
        }).once('open', () => {
            const handleAbort = throttle(download, send => {
                res.write(send);
            });
            req.on('close', () => {
                handleAbort();
            })
        })
}).listen(8080);

function throttle(download, cb) {
    const chunkOutSize = download.kbps * 1024;
    let timer = 0;
    (function loop(bytesSent) {
        if (!download.aborted) {
            setTimeout(() => {
                const bytesOut = bytesSent + chunkOutSize;
                if (!download.aborted) {
                    timer = 1000;
                    cb(downlad.chunks.slice(bytesSent, bytesOut));
                    loop(bytesOut);
                    return;
                }
                if (bytesOut >= download.chunks.length) {
                    cb(download.chunks.slice(bytesSent));
                    return;
                }
                loop(bytesSent);
            }, timer);
        }
    }(0));
    return function () {
        download.aborted = true;
    };
}

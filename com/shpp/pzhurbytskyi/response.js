function readHttpLikeInput() {
    var fs = require("fs");
    var res = "";
    var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
    let was10 = 0;
    for (; ;) {
        try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1); } catch (e) { break; /* windows */ }
        if (buffer[0] === 10 || buffer[0] === 13) {
            if (was10 > 10)
                break;
            was10++;
        } else
            was10 = 0;
        res += new String(buffer);
    }

    return res;
}


let contents = readHttpLikeInput();

/**
 * Takes http request as text and return new object based on request.
 * @param {string} string http request.
 * @returns new object which contains data from http request.
 */
function parseTcpStringAsHttpRequest(string) {
    const request = string.split('\n');
    const firstLine = request[0];
    const headers = request
        .filter(e => e.includes(':'))
        .map(e => e.split(': '))
        .reduce((headers, header) => {
            const key = header[0].toLowerCase().replace(/\w+/g, e => e.replace(e[0], e[0].toUpperCase()));
            headers[key] = header[1];
            return headers;
        }, {});
    const body = request.find(e => e.includes('='));
    return {
        method: firstLine.split(' ')[0],
        uri: firstLine.split(' ')[1],
        headers: headers,
        body: body,
    };
}

/**
 * Shows to console http response.
 * @param {number} statusCode response code.
 * @param {string} statusMessage response status Message.
 * @param {{}} headers response headers.
 * @param {string} body response body.
 */
function outputHttpResponse(statusCode, statusMessage, headers, body) {
    console.log(
        `HTTP/1.1 ${statusCode} ${statusMessage}
Date: ${new Date()}
Server: Apache/2.2.14 (Win32)
Connection: Closed
Content-Type: text/html; charset=utf-8
Content-Length: ${(body + '').length}

${body}`);
}

/**
 * Proccess http request and returns response.
 * @param {string} $method request method.
 * @param {string} $uri request uri.
 * @param {{}} $headers request headers.
 * @param {string} $body request body.
 */
function processHttpRequest($method, $uri, $headers, $body) {
    if ($method === 'GET' && $uri.startsWith('/sum?nums=')) {
        const sum = $uri
            .substring($uri.indexOf('=') + 1)
            .split(',')
            .map(e => Number.parseInt(e))
            .reduce((s, e) => {
                s += e;
                return s;
            }, 0);
        outputHttpResponse(200, 'OK', $headers, sum);
    } else if (!$uri.startsWith('/sum')) {
        outputHttpResponse(404, 'Not found', $headers, 'not found');
    } else if ($method !== 'GET' || !$uri.includes('?nums=')) {
        outputHttpResponse(400, 'Bad Request', $headers, 'bad request');
    }

}

http = parseTcpStringAsHttpRequest(contents);
processHttpRequest(http.method, http.uri, http.headers, http.body);

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

http = parseTcpStringAsHttpRequest(contents);
console.log(JSON.stringify(http, undefined, 2));


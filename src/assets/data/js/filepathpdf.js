var path = require('path');
var os = require('os');

function getFile() {
    return path.join(os.tmpdir(), 'print.pdf');
}


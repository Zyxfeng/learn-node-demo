const fspromises = require('fs').promises;

async function openAndClose() {
    let filehandle;
    try {
        filehandle = await fspromises.open('app.js', 'r');
    } finally {
        if (filehandle !== undefined) {
            console.log('I am open a file');
            await filehandle.close();
        }
    }
}

openAndClose();
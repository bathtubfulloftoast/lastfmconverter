import express from 'express';
import fs from 'node:fs';

try {
    if (!fs.existsSync("full")) {
        fs.mkdirSync("full");
    }
} catch (err) {
    console.error(err);
}
try {
    if (!fs.existsSync("converted")) {
        fs.mkdirSync("converted");
    }
} catch (err) {
    console.error(err);
}

const app = express();
const port = 4567;

import index from './functions/index.js';
import fullsize from './functions/full.js';
import info from './functions/info.js';


app.get('/', (req, res) => {
    res.redirect('https://github.com/bathtubfulloftoast/lastfmconverter');
});

app.get('/albumcovers/:image', index);
app.get('/albumcovers/full/:image', fullsize);
app.get('/albumcovers/info/:image', info);

app.use((req, res) => {
    res.status(404).json({error: "404 not found"});
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

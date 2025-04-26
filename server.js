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


app.get('/', (req, res) => {
    res.redirect('https://github.com/bathtubfulloftoast/lastfmconverter');
});

app.get('/albumcovers', index);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

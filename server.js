import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/albumcovers', index);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

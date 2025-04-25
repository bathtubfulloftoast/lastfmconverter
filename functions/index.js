import { convertimage } from './convert.js';

let size;
let file;
let format;
let censored = 0;

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

const filetypes = ["png","jpg","jpeg","gif","webp"];

export default async function lastfmHandler(req, res) {

size = req.query.size;
file = req.query.file;
format = req.query.format;
censored = req.query.censored;

format = format.toLowerCase();

if (size > 2048) {
size = 2048;
} else if (size < 16) {
size = 16;
}

if (censored > 65) {
censored = 65;
} else if (censored < 5) {
censored = 5;
} else if (!censored) {
censored = 0;
}

if (/[^0-9]/.test(size)) {
return res.status(400).json({error:"invalid size"});
}

if (/[^0-9]/.test(censored)) {
return res.status(400).json({error:"invalid censorship level"});
}

size = Math.pow(2, Math.floor(Math.log2(size)));

const outputimage = await convertimage(file, size, format, censored);
res.set('Content-Type', 'image/jpeg');
return res.status(200).send(outputimage);

//return res.status(200).json({size:size,file:file,format:format,censored:censored});
}

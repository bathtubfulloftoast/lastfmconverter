import fs from 'node:fs';
import { md5 } from 'js-md5';

import { convertimage } from './convert.js';
import { grabimage } from './grab.js';

let size;
let file;
let format;
let censored;
let destination;

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

const filetypes = ["png","jpg","jpeg","webp"];

export default async function lastfmHandler(req, res) {

size = req.query.size;
file = req.query.file;
format = req.query.format;
censored = req.query.censored;

var filematch = file.match(/(?:\/|\\)?([^\/\\]+)\.(\w+)$/);

let filnme = filematch?.[1];
let filext = filematch?.[2];

format = format.toLowerCase();
filext = filext.toLowerCase();

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

size = Math.pow(2, Math.floor(Math.log2(size)));


destination = md5(size+file+format+censored)+`.${format}`;

if (/[^0-9]/.test(size)) {
return res.status(400).json({error:"invalid size"});
} else if (/[^0-9]/.test(censored)) {
return res.status(400).json({error:"invalid censorship level"});
} else if (!filetypes.includes(format)) {
return res.status(400).json({error:"invalid conversion filetype"});
} else if (!filetypes.includes(filext)) {
return res.status(400).json({error:"invalid filetype"});
} else if (!fs.existsSync(`full/${file}`)) {
    const grabbedimage = await grabimage(file);

    if (grabbedimage == "error") {
        return res.status(400).json({ error: "invalid album cover" });
    } else {
        // await the write
        await new Promise((resolve, reject) => {
            fs.writeFile(`./full/${file}`, grabbedimage, err => {
                if (err) {
                    console.error(err);
                    return reject(err);
                } else {
                    console.log(`cached "${file}" successfully`);
                    return resolve();
                }
            });
        });
    }
}



if (format === 'jpeg' || format === 'jpg') {
    res.set('Content-Type', 'image/jpeg');
} else if (format === 'png') {
    res.set('Content-Type', 'image/png');
} else if (format === 'webp') {
    res.set('Content-Type', 'image/webp');
} // me when i hardcode the content type

res.setHeader('Content-Disposition', `inline; filename="${filnme}.${format}"`);



if (fs.existsSync(`./converted/${destination}`)) {

fs.readFile(`./converted/${destination}`, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("grabbed cached convert");
  return res.status(200).send(data);
});

} else {
const outputimage = await convertimage(file, size, format, censored);

fs.writeFile(`./converted/${destination}`, outputimage, err => {
  if (err) {
    console.error(err);
  } else {
  console.log(`cached "${destination}"`);
  return res.status(200).send(outputimage);
  }
});
}



//return res.status(200).json({size:size,file:file,format:format,censored:censored});
}

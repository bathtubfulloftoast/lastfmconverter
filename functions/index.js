import fs from 'node:fs';

import { convertimage } from './convert.js';
import { grabimage } from './grab.js';

let size;
let file;
let format;
let censored = 0;

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

if (censored > 65) {
censored = 65;
} else if (censored < 5) {
censored = 5;
} else if (!censored) {
censored = 0;
}



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


const outputimage = await convertimage(file, size, format, censored);
res.set('Content-Type', 'image/webp');
res.setHeader('Content-Disposition', `inline; filename="${filnme}.${format}"`);

return res.status(200).send(outputimage);






//return res.status(200).json({size:size,file:file,format:format,censored:censored});
}

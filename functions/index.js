import fs from 'node:fs';
import { md5 } from 'js-md5';

import { convertimage } from './convert.js';
import { grabimage } from './grab.js';

const filetypes = ["png", "jpg", "jpeg", "webp"];

export default async function lastfmHandler(req, res) {
    let { size, file, format, censored } = req.query;

    if (!file || file === "invalid") {
        return res.status(400).json({ error: "no file set" });
    }

    let filematch = file.match(/(?:\/|\\)?([^\/\\]+)\.(\w+)$/);
    let filnme = filematch?.[1];
    let filext = filematch?.[2];

    if (size > 2048) size = 2048;
    else if (size < 16) size = 16;

    censored = Number(censored);
    if (censored > 65) censored = 65;
    else if (censored < 5) censored = 5;
    if (!censored) censored = 0;

    censored = Math.floor(censored / 5) * 5;
    size = Math.pow(2, Math.floor(Math.log2(size)));

    const destination = md5(size + file + format + censored + format) + `.${format}`;

    if (/[^0-9]/.test(size)) {
        return res.status(400).json({ error: "invalid size" });
    }
    if (/[^0-9]/.test(censored)) {
        return res.status(400).json({ error: "invalid censorship level" });
    }
    if (!filetypes.includes(format)) {
        return res.status(400).json({ error: "invalid conversion filetype" });
    }
    if (!filetypes.includes(filext)) {
        return res.status(400).json({ error: "invalid source filetype" });
    }

    // Check if the file exists
    if (!fs.existsSync(`full/${file}`)) {
        const grabbedimage = await grabimage(file);
        if (grabbedimage === "error") {
            return res.status(400).json({ error: "invalid album cover" });
        }
        await fs.promises.writeFile(`./full/${file}`, grabbedimage);
        console.log(`cached "${file}" successfully`);
    }

    format = format.toLowerCase();
    filext = filext.toLowerCase();
    const contentTypeMap = {
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
    };
    res.set('Content-Type', contentTypeMap[format]);

    res.setHeader('Content-Disposition', `inline; filename="${filnme}.${format}"`);

    try {
        if (await fs.promises.access(`./converted/${destination}`).then(() => true).catch(() => false)) {
            const data = await fs.promises.readFile(`./converted/${destination}`);
            console.log(`grabbed cached convert "${destination}"`);
            return res.status(200).send(data);
        } else {
            const outputimage = await convertimage(file, size, format, censored);
            await fs.promises.writeFile(`./converted/${destination}`, outputimage);
            console.log(`cached "${destination}"`);
            return res.status(200).send(outputimage);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" });
    }
}

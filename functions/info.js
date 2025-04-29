import fs from 'node:fs';
import mime from 'mime';
import { grabimage } from './grab.js';
import sharp from 'sharp';

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default async function(req, res) {
    const image = req.params.image;
    const imagePath = `./full/${image}`;
    const mime_type = mime.getType(imagePath);

if (fs.existsSync(imagePath)) {
try {
const sharpimage = await sharp(imagePath);
const metadata = await sharpimage.metadata();
const width = metadata.width;
const height = metadata.height;

fs.stat(imagePath, (err, stats) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error getting file stats' });
    }

    fs.readFile(imagePath, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading file' });
        }

        return res.status(200).json({
            file: image,
            width: width,
            height: height,
            size: formatBytes(stats.size),
            modified: stats.mtime.toLocaleString() // ISO string for easy parsing
        });
    });
});
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Error processing image' });
}
} else {
try {
const grabbedimage = await grabimage(image);

if (grabbedimage === "error") {
    return res.status(404).json({ error: "album cover not found" });
} else {
await new Promise((resolve, reject) => {
fs.writeFile(imagePath, grabbedimage, err => {
if (err) {
    console.error(err);
    return reject(err);
} else {
    console.log(`cached "${image}" successfully`);
    return resolve();
}
});
});

const newImage = await fs.promises.readFile(imagePath);
res.set('Content-Type', mime_type);
return res.status(200).send(newImage);
}
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Error grabbing or saving image' });
}
}
}

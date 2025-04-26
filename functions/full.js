import fs from 'node:fs';
import mime from 'mime';
import { grabimage } from './grab.js';

export default async function(req, res) {
    const image = req.params.image;
    const imagePath = `./full/${image}`;
    const mime_type = mime.getType(imagePath);

    if (fs.existsSync(imagePath)) {

        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error reading file' });
            }
            res.set('Content-Type', mime_type);
            return res.status(200).send(data);
        });

    } else {
        try {
            const grabbedimage = await grabimage(image);

            if (grabbedimage === "error") {
                return res.status(400).json({ error: "invalid album cover" });
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

import sharp from 'sharp';
export async function convertimage(file, size, format, censor) {
    try {
        const data = await sharp(`./full/${file}`)
        .resize(size)
        .jpeg({ mozjpeg: true })
        .toBuffer();

        console.log({size:size,file:file,format:format,censored:censor})
        return data;

    } catch (err) {
        console.error("Error converting image:", err);
        return null;
    }
}


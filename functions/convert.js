import sharp from 'sharp';

export async function convertimage(file, size, format, censor) {
    try {
        const inputPath = `./full/${file}`;
        const image = await sharp(inputPath);

        const metadata = await image.metadata();
        const width = metadata.width;
        const height = metadata.height;
        var ogsize = ((width+height)/2);

        if (ogsize < size) {
        size = ogsize;
        }

        size = Math.pow(2, Math.floor(Math.log2(size))); // restate this in case it gets out of hand. (that one pixel difference WILL NOT happen on my track)


        let output = image.resize({ width: size });

        if (format === 'jpeg' || format === 'jpg') {
            output = output.jpeg({ mozjpeg: true });
        } else if (format === 'png') {
            output = output.png();
        } else if (format === 'webp') {
            output = output.webp();
        }

        const buffer = await output.toBuffer();

        console.log({ size, file, format, censored: censor });
        return buffer;

    } catch (err) {
        console.error("Error converting image:", err);
        return null;
    }
}

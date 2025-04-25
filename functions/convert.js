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

        if (size > 2048) {
            size = 2048;
        } else if (size < 16) {
            size = 16;
        }

        size = Math.pow(2, Math.floor(Math.log2(size)));


        let output = image.resize({ width: size });

        // Apply format-specific conversion
        if (format === 'jpeg' || format === 'jpg') {
            output = output.jpeg({ mozjpeg: true });
        } else if (format === 'png') {
            output = output.png();
        } else if (format === 'webp') {
            output = output.webp();
        } // Add more formats as needed

        const buffer = await output.toBuffer();

        console.log({ size, file, format, censored: censor });
        return buffer;

    } catch (err) {
        console.error("Error converting image:", err);
        return null;
    }
}

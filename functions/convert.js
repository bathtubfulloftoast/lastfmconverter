import sharp from 'sharp';



export async function convertimage(file, size, format, censor) {
    let output;
    let censored;
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

        if (censor == 0) {
            output = image.resize({ width: size, height: size, fit: "inside" });
        } else {
        const tinyBuffer = await image
        .resize({ width: 500, height: 500, fit: "fill"  })
        .gamma(3,2)
        .blur(Math.round(censor/2))
        .toBuffer();

        censored = sharp(tinyBuffer);
        output = censored.resize({ width: size, height: size, fit: "fill" });
        }



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

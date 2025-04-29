import sharp from 'sharp';

export async function convertimage(file, size, format, censor) {
    let output;
    let censored;
    let blurred;
    try {
        const inputPath = `${file}`;
        const image = await sharp(inputPath);

        const metadata = await image.metadata();
        const width = metadata.width;
        const height = metadata.height;
        var ogsize = Math.floor((width+height)/2);

        if (ogsize < size) {
        size = ogsize;
        }

        if (censor == 0) {
            output = image.resize({ width: size, height: size, fit: "inside" });
        } else {
        const blurBuffer = await image
        .resize({ width: 100, height: 100, fit: "fill"  })
        .blur(1.5)
        .gamma(3,2)
        .toBuffer();

        blurred = sharp(blurBuffer);

        const scaleBuffer = await blurred
        .resize({ width: censor, height: censor, fit: "fill",kernel: sharp.kernel.nearest  })
        .toBuffer();

        censored = sharp(scaleBuffer);
        output = censored.resize({ width: size, height: size, fit: "fill",kernel: sharp.kernel.nearest });
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

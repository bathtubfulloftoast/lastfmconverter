const filetypes = ["png", "jpg"];

export async function grabimage(file) {
    let filematch = file.match(/(?:\/|\\)?([^\/\\]+)\.(\w+)$/);
    let filext = filematch?.[2];

    if (!filetypes.includes(filext)) {
    return "error";//apparently i need to handle this because lastfm doesnt want to sometimes???
    }

    let url = `https://lastfm.freetls.fastly.net/i/u/${file}`;



    try {
        const response = await fetch(url);

        if (!response.ok) {
        console.log(`cover "${file}" failed to grab with status ${response.status} (${response.statusText})`);
        return "error";
        }

        console.log(`grabbed "${file}" from lastfm`);
        const buffer = await response.arrayBuffer();
        return Buffer.from(buffer);
    } catch (error) {
        console.error({ error: error.message });
        return null;
    }
}

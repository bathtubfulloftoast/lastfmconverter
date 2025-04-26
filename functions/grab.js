export async function grabimage(file) {
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
